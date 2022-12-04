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
import { useEffect } from "react";
import { Payment } from "../types";
import { motion } from "framer-motion";

type PaymentFormProps = Omit<BoxProps, "onSubmit"> &
  Partial<Payment> & {
    onSubmit?: (payment: Payment) => unknown;
    onUpdate?: (payment: Payment) => unknown;
    resetOnSubmit?: boolean;
    rightAction?: "add" | "remove";
  };

const PaymentForm = ({
  onSubmit: onSubmitProp,
  onUpdate,
  amount: amount = 0,
  id,
  description = "",
  resetOnSubmit = false,
  rightAction = "add",
  ...boxProps
}: PaymentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    setFocus,
  } = useForm<Payment>({
    defaultValues: { amount: amount, id: id || cuid(), description },
  });
  const [watchedamount, watchedName] = watch(["amount", "description"]);
  useEffect(() => {
    const userId = getValues("id");
    onUpdate?.({
      id: userId,
      amount: watchedamount,
      description: watchedName,
    });
  }, [watchedamount, watchedName]);

  const onSubmit = (user: Payment) => {
    onSubmitProp?.(user);
    setFocus("description");
    if (resetOnSubmit) {
      reset();
      setValue("id", cuid());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      key={id}
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
                placeholder="Payment description"
                maxWidth="sm"
                {...register("description", { required: true, minLength: 1 })}
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
                {...register("amount", {
                  valueAsNumber: true,
                  min: 0,
                  required: true,
                })}
                onFocus={(e) =>
                  e.currentTarget.value === "0" && e.currentTarget.select()
                }
              />
            </InputGroup>
            <Button type="submit">{rightAction === "add" ? "+" : "-"}</Button>
          </Flex>
        </form>
      </Box>
    </motion.div>
  );
};

export default PaymentForm;
