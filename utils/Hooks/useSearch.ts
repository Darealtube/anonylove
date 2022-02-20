import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SEARCH_USER_QUERY } from "../../apollo/query/searchQuery";
import { searchUserResult, searchUserVariables } from "../../types/Queries";

const useSearch = (key: string, searchOpen: boolean) => {
  const [typing, setTyping] = useState(false);
  const [searchUser, { loading, data }] = useLazyQuery<
    searchUserResult,
    searchUserVariables
  >(SEARCH_USER_QUERY);

  // If the search bar is active, detect if the user is still typing in the search bar based on input change (key).
  useEffect(() => {
    let typeTimer: NodeJS.Timeout; // TypeTimer is obviously a timeout function
    if (searchOpen) {
      setTyping(true);
      typeTimer = setTimeout(() => {
        setTyping(false);
      }, 1000); // Amount of milliseconds before search trigger
    }
    return () => {
      clearTimeout(typeTimer);
    };
  }, [searchOpen, key]);

  useEffect(() => {
    if (!typing && searchOpen) {
      searchUser({
        variables: { key },
      });
    }
  }, [key, searchUser, typing, searchOpen]);

  return { loading, data };
};

export default useSearch;
