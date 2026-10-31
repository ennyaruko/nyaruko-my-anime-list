import { useOutletContext } from "react-router";

import { MyListPage } from "@/pages/my-list";

import { AccountState } from "@/entities/account";

export default function HomeRoute() {
  const accountContext = useOutletContext<AccountState>();
  return <MyListPage {...accountContext} />;
}
