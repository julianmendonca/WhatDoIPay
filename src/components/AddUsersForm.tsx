import {
  Box,
  Divider,
  ListItem,
  Tag,
  Text,
  UnorderedList,
  useColorMode,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Payment, User } from "../types";
import { splitExpences } from "../utils/splitAlgorithm";
import useLocalStorage from "../utils/useLocalStorage";
import AddUserInput from "./AddUserInput";
import PaymentDebts from "./PaymentDebts";
import PaymentForm from "./PaymentForm";
import UserPayments from "./UserPayments";

const AddUsersForm = () => {
  const { colorMode } = useColorMode();
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [pendingPayments, setPendingPayments] = useState<
    ReturnType<typeof splitExpences>
  >([]);

  const addPaymentToUser = ({
    userId,
    payment,
  }: {
    userId: string;
    payment: Payment;
  }) => {
    setUsers((prevUsers) => {
      const copy = [...prevUsers];
      copy.find((user) => user.id === userId)?.payments.push(payment);
      return copy;
    });
  };

  const updateUserPayment = ({
    userId,
    payment,
  }: {
    userId: string;
    payment: Payment;
  }) => {
    setUsers((prevUsers) => {
      const usersCopy = [...prevUsers];
      const foundUser = usersCopy.find((i) => i.id === userId);
      const paymentsCopy = [...(foundUser?.payments || [])];
      const paymentToUpdate = paymentsCopy.find(
        (paymentCopy) => paymentCopy.id === payment.id
      );
      if (paymentToUpdate && foundUser) {
        paymentToUpdate.amount = payment.amount;
        paymentToUpdate.description = payment.description;
        foundUser.payments = paymentsCopy;
      }
      return usersCopy;
    });
  };

  const deleteUserPayment = ({
    userId,
    payment,
  }: {
    userId: string;
    payment: Payment;
  }) => {
    setUsers((prevUsers) => {
      const usersCopy = [...prevUsers];
      const user = usersCopy.find((user) => user.id === userId);
      let userPayments = user?.payments;
      userPayments = userPayments?.filter(
        (userPayment) => userPayment.id !== payment.id
      );
      if (userPayments && user) {
        user.payments = userPayments;
      }
      console.log({ usersCopy, userPayments });
      return usersCopy;
    });
  };

  const addUser = (user: User) => setUsers((prev) => [user, ...prev]);

  const removeUser = (userId: string) => {
    console.log(userId);
    setUsers((prev) => prev.filter((i) => i.id !== userId));
  };

  useEffect(() => {
    setPendingPayments(splitExpences(users));
  }, [users]);

  return (
    <>
      <AddUserInput onSubmit={addUser} mb="14" />
      {users.map((user) => (
        <UserPayments
          key={user.id}
          name={user.name}
          userId={user.id}
          payments={user.payments}
          onSubmit={addPaymentToUser}
          onUpdate={updateUserPayment}
          onDeletePayment={deleteUserPayment}
          onDeleteUser={removeUser}
        />
      ))}
      <Divider size="xl" mt="24" mb="5" />

      <Text fontSize="2xl" mb="5">
        The following people must make payments
      </Text>
      {pendingPayments.length === 0 && (
        <Text fontSize="lg " mt="-2" color="gray.600">
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
          <PaymentDebts payments={pendingPayment.shouldPayTo} />
        </Box>
      ))}
    </>
  );
};

export default AddUsersForm;
