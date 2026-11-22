import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";

// Único lugar onde os plugins são registrados.
// Todos os módulos importam gsap DAQUI, garantindo o registro antes do uso.
gsap.registerPlugin(useGSAP, CustomEase, Observer, SplitText);

// Linguagem de movimento da marca
CustomEase.create("ms.inOut", "0.77, 0, 0.18, 1"); // wipes e transições de slide
CustomEase.create("ms.out", "0.16, 1, 0.3, 1"); // entradas rápidas e decididas

export { gsap, useGSAP, Observer, SplitText };

export type Direction = 1 | -1;