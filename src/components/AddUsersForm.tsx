import {
  Box,
  Button,
  ListItem,
  Tag,
  Text,
  UnorderedList,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../types/user";
import { splitExpences } from "../utils/splitAlgorithm";
import useLocalStorage from "../utils/useLocalStorage";
import UserForm from "./UserForm";

const AddUsersForm = () => {
  const { colorMode } = useColorMode();
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [pendingPayments, setPendingPayments] = useState<
    ReturnType<typeof splitExpences>
  >([]);

  const onAddUserSubmit = (user: User) => {
    setUsers((prevUsers) => [user, ...prevUsers]);
  };

  const handleUpdate = (user: User) => {
    setUsers((prevUsers) => {
      const usersCopy = [...prevUsers];
      const foundUser = usersCopy.find((i) => i.id === user.id);
      if (foundUser) {
        foundUser.amountPaid = user.amountPaid;
        foundUser.name = user.name;
      }
      return usersCopy;
    });
  };

  const handleRemove = (user: User) => {
    setUsers((prev) => prev.filter((i) => i.id !== user.id));
  };

  useEffect(() => {
    setPendingPayments(splitExpences(users));
  }, [users]);

  return (
    <>
      <UserForm onSubmit={onAddUserSubmit} resetOnSubmit marginY="5" />
      {users.map((user) => (
        <UserForm
          amountPaid={user.amountPaid}
          name={user.name}
          key={user.id}
          id={user.id}
          onUpdate={handleUpdate}
          onSubmit={handleRemove}
          rightAction={"remove"}
          marginBottom="5"
        />
      ))}
      <Text fontSize="2xl" mb="5" mt="24">
        The following people must make payments
      </Text>
      {pendingPayments.length === 0 && (
        <Text fontSize="lg " mt="-2" color="gray.300">
          No pending payments
        </Text>
      )}
      {pendingPayments?.map((pendingPayment) => (
        <Box key={pendingPayment.id}>
          <Tag
            size={"lg"}
            variant="solid"
            colorScheme={colorMode === "dark" ? "teal" : "blackAlpha"}
            boxShadow="lg"
            textTransform="capitalize"
          >
            {pendingPayment.name}
          </Tag>
          <UnorderedList ml="10" my="5">
            {pendingPayment.shouldPayTo.map((payment) => (
              <ListItem key={payment.id}>
                <Text key={payment.id}>
                  Pay ${payment.amount} to{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {payment.name}
                  </span>
                </Text>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      ))}
    </>
  );
};

export default AddUsersForm;
