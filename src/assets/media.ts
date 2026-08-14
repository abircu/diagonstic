import diagonosticOne from "./diagonostic-one.jpg";
import diagonosticTwo from "./diagonostic-two.jpg";
import diagonosticThree from "./diagonostic-three.jpg";
import diagonosticFour from "./diagonostic-four.jpg";
import schoolOne from "./school-one.jpg";
import schoolTwo from "./school-two.jpg";

export const media = {
  diagnostic: {
    one: diagonosticOne,
    two: diagonosticTwo,
    three: diagonosticThree,
    four: diagonosticFour,
  },
  school: {
    one: schoolOne,
    two: schoolTwo,
  },
} as const;

export const diagnosticGallery = [
  { src: diagonosticOne, key: "one" },
  { src: diagonosticTwo, key: "two" },
  { src: diagonosticThree, key: "three" },
  { src: diagonosticFour, key: "four" },
] as const;

export const schoolGallery = [
  { src: schoolOne, key: "one" },
  { src: schoolTwo, key: "two" },
] as const;
