import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Heading, Text, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import AddUsersForm from "../src/components/AddUsersForm";
import UserInput from "../src/components/PaymentForm";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Split the expences easily!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button onClick={toggleColorMode} mt="5">
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
      <Heading textAlign="center" mt="10" mb="5">
        Who Should Pay?
      </Heading>
      <Text textAlign="center" mb="16">
        Add users and all the payments made by them, then take a look at the
        bottom to check to whom each one has to make a payment to
      </Text>
      <AddUsersForm />
    </div>
  );
}
