import { ListItem, UnorderedList, Text } from "@chakra-ui/react";

type PaymentDebtsProps = {
  payments: {
    id: string;
    name: string;
    amount: number;
  }[];
};

const PaymentDebts = ({ payments }: PaymentDebtsProps) => {
  return (
    <UnorderedList ml="10" my="5">
      {payments.map((payment) => (
        <ListItem key={payment.id}>
          <Text key={payment.id}>
            Pay ${payment.amount} to{" "}
            <span style={{ textTransform: "capitalize" }}>{payment.name}</span>
          </Text>
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default PaymentDebts;
