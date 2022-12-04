import { useForm } from "react-hook-form";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import cuid from "cuid";
import { useEffect } from "react";
import { Payment, User } from "../types";
import { motion } from "framer-motion";

type AddUserInputProps = Omit<BoxProps, "onSubmit"> &
  Partial<Payment> & {
    onSubmit?: (user: User) => unknown;
  };

const AddUserInput = ({
  onSubmit: onSubmitProp,
  ...boxProps
}: AddUserInputProps) => {
  const { register, handleSubmit, reset, setValue, setFocus } = useForm<User>({
    defaultValues: { name: "", id: cuid(), payments: [] },
  });

  const onSubmit = (user: User) => {
    onSubmitProp?.(user);
    setFocus("name");
    reset();
    setValue("id", cuid());
  };

  return (
    <Box {...boxProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={["column", "row"]} width="fit-content" margin="0 auto">
          <Text
            width="32"
            fontWeight="bold"
            fontSize={["lg", "2xl"]}
            margin={["5px auto", "0"]}
          >
            Add User
          </Text>
          <Flex margin="0 auto">
            <InputGroup>
              <Input
                textTransform="capitalize"
                placeholder="User Name"
                maxWidth="sm"
                mr="5"
                {...register("name", { required: true, minLength: 1 })}
              />
            </InputGroup>
            <Button type="submit">+</Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};

export default AddUserInput;
