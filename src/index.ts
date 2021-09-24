import {test} from "./myfile.js";
import { LitElement, html } from "lit";

function bla() {
    console.log(test());

    const temp = html`This is a test`;

    console.log(temp);
}

bla();