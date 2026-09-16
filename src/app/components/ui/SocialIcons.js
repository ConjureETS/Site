import { SiItchdotio, SiLinktree } from "react-icons/si";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaDiscord } from "react-icons/fa";

/**
 * Maps a social `key` (as used in data/site.json) to its icon.
 * Add a new social network by adding one line here + one entry in
 * data/site.json — nothing else needs to change.
 */
export const SOCIAL_ICONS = {
  discord: FaDiscord,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  itchio: SiItchdotio,
  facebook: FaFacebookF,
  linktree: SiLinktree,
};
