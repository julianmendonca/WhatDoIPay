import { useForm } from "react-hook-form";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import cuid from "cuid";
import { useEffect, useRef } from "react";
import { User } from "../types/user";
import { AnimatePresence, motion } from "framer-motion";

type UserFormProps = Omit<BoxProps, "onSubmit"> &
  Partial<User> & {
    onSubmit?: (user: User) => unknown;
    onUpdate?: (user: User) => unknown;
    resetOnSubmit?: boolean;
    rightAction?: "add" | "remove";
  };

const UserForm = ({
  onSubmit: onSubmitProp,
  onUpdate,
  amountPaid = 0,
  id,
  name = "",
  resetOnSubmit = false,
  rightAction = "add",
  ...boxProps
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    setFocus,
  } = useForm<User>({
    defaultValues: { amountPaid, id: id || cuid(), name },
  });
  const [watchedAmountPaid, watchedName] = watch(["amountPaid", "name"]);
  useEffect(() => {
    const userId = getValues("id");
    onUpdate?.({
      id: userId,
      amountPaid: watchedAmountPaid,
      name: watchedName,
    });
  }, [watchedAmountPaid, watchedName]);

  const onSubmit = (user: User) => {
    onSubmitProp?.(user);
    setFocus("name");
    if (resetOnSubmit) {
      reset();
      setValue("id", cuid());
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, top: "100px" }}
        animate={{ opacity: 1, top: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        key={name}
      >
        <Box {...boxProps}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) =>
              // Disable submit on "Enter" key
              rightAction === "remove" && e.key == "Enter" && e.preventDefault()
            }
          >
            <Flex maxW="900" margin="0 auto">
              <InputGroup>
                <Input
                  textTransform="capitalize"
                  placeholder="Name"
                  maxWidth="sm"
                  {...register("name", { required: true, minLength: 1 })}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  $
                </InputLeftElement>
                <Input
                  placeholder="Amount Paid"
                  type="number"
                  maxWidth="sm"
                  onKeyDown={(e) => e.charCode >= 48}
                  {...register("amountPaid", {
                    valueAsNumber: true,
                    min: 0,
                    required: true,
                  })}
                />
              </InputGroup>
              <Button type="submit">{rightAction === "add" ? "+" : "-"}</Button>
            </Flex>
          </form>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserForm;
