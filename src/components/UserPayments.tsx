import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { Payment } from "../types";
import PaymentForm from "./PaymentForm";

type UserPaymentsProps = {
  userId: string;
  name: string;
  payments: Payment[];
  onSubmit: (data: { userId: string; payment: Payment }) => unknown;
  onDeletePayment: (data: { userId: string; payment: Payment }) => unknown;
  onUpdate: (data: { userId: string; payment: Payment }) => unknown;
  onDeleteUser: (userId: string) => unknown;
};

const UserPayments = ({
  name,
  payments,
  userId,
  onSubmit,
  onDeletePayment,
  onUpdate,
  onDeleteUser,
}: UserPaymentsProps) => {
  return (
    <Accordion allowToggle defaultIndex={0}>
      <AccordionItem borderBottom="none">
        <h2>
          <AccordionButton
            display="flex"
            justifyContent="space-between"
            textTransform="capitalize"
            backgroundColor="blackAlpha.300"
            mb="5"
          >
            <Text>{name}</Text>
            <Flex
              justifyContent="space-between"
              textAlign="left"
              flexDirection="row"
            >
              <Text mr="5">
                Total paid: $
                {payments.reduce((prev, curr) => prev + curr.amount, 0)}
              </Text>
              <AccordionIcon />
            </Flex>
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Flex
            mb="5"
            alignItems={["flex-start", "flex-start", "center"]}
            justifyContent="space-between"
            direction={["column-reverse", "column-reverse", "row"]}
          >
            <Flex
              direction={["column", "column", "row"]}
              alignItems="center"
              margin={["0 auto", "0 auto", "0"]}
            >
              <Text mr="5" mt={["5", "5", "0"]}>
                Add Payment:
              </Text>
              <PaymentForm
                onSubmit={(newPayment) =>
                  onSubmit({ userId, payment: newPayment })
                }
                resetOnSubmit
                marginY="5"
              />
            </Flex>
            <Button onClick={() => onDeleteUser(userId)}>Delete User</Button>
          </Flex>
          {!payments?.length && (
            <Text fontSize="lg " mt="-2" color="gray.600">
              <span style={{ textTransform: "capitalize" }}>{name}</span>{" "}
              {"hasn't"} made any payments
            </Text>
          )}
          {
            <AnimatePresence>
              {payments?.map((payment) => (
                <PaymentForm
                  amount={payment.amount}
                  description={payment.description}
                  key={payment.id}
                  id={payment.id}
                  onUpdate={(updatedPayment) =>
                    onUpdate({ userId, payment: updatedPayment })
                  }
                  onSubmit={(paymentToDelete) =>
                    onDeletePayment({ userId, payment: paymentToDelete })
                  }
                  rightAction={"remove"}
                  marginBottom="5"
                />
              ))}
            </AnimatePresence>
          }
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default UserPayments;
