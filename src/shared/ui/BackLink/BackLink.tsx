import { useNavigate } from "react-router";

import { ArrowDownIcon } from "@/shared/icons";

import { Button } from "../Button";

export function BackLink({ children }: { children: string }) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="flat"
      onClick={() => navigate(-1)}
      leftIcon={<ArrowDownIcon />}
    >
      {children}
    </Button>
  );
}
