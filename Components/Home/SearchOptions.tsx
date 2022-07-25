import { ListItem, ListItemAvatar, Box, ListItemText } from "@mui/material";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { User } from "../../types/models";
import Image from "next/image";
import NoUserImg from "../../public/anonyUser.png";

const SearchOptions = ({
  props,
  option,
}: {
  props: HTMLAttributes<HTMLLIElement>;
  option: unknown;
}) => {
  return (
    <Link href={`/profile/${(option as User).name}`} passHref>
      <a>
        <ListItem {...props}>
          <ListItemAvatar>
            <Box sx={{ width: 40, height: 40, position: "relative" }}>
              <Image
                src={(option as User).image ?? NoUserImg}
                alt="PFP"
                layout="fill"
                objectFit="cover"
                className="avatar"
              />
            </Box>
          </ListItemAvatar>
          <ListItemText primary={(option as User).name} secondary="Heya!" />
        </ListItem>
      </a>
    </Link>
  );
};

export default SearchOptions;
