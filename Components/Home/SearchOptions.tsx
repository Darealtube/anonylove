import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { User } from "../../types/models";
import Image from "next/image";
import NoUserImg from "../../public/anonyUser.png";
import { AnonyAvatar } from "../Style/Global/AnonyAvatar";

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
            <AnonyAvatar>
              <Image
                src={(option as User).image ?? NoUserImg}
                alt="PFP"
                layout="fill"
                objectFit="cover"
                className="avatar"
              />
            </AnonyAvatar>
          </ListItemAvatar>
          <ListItemText primary={(option as User).name} secondary="Heya!" />
        </ListItem>
      </a>
    </Link>
  );
};

export default SearchOptions;
