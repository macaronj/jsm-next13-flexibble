"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

type Props = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const LoadMore = ({
  startCursor,
  endCursor,
  hasNextPage,
  hasPreviousPage,
}: Props) => {
  const router = useRouter();
  const handleNavigation = (direction: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (direction === "next" && hasNextPage) {
      currentParams.delete("startcursor");
      currentParams.set("endCursor", endCursor);
    } else if (direction === "prev" && hasPreviousPage) {
      currentParams.delete("endCursor");
      currentParams.set("startCursor", startCursor);
    }

    const newSearchParams = currentParams.toString();
    const newPathName = `${window.location.pathname}?${newSearchParams}`;
    router.push(newPathName);
  };
  return (
    <div className="w-full flexCenter gap-5 mt-10">
      {hasPreviousPage && (
        <Button
          title="Prev Page"
          handleClick={() => {
            handleNavigation("prev");
          }}
        ></Button>
      )}
      {hasNextPage && (
        <Button
          title="Next Page"
          handleClick={() => {
            handleNavigation("next");
          }}
        ></Button>
      )}
    </div>
  );
};
export default LoadMore;
