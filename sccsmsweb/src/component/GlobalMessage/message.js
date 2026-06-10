import { createRoot } from "react-dom/client";
import GlobalMessage from "./GlobalMessage";

const message = {
    dom: null,
    success(content, duration=2000) {
        this.dom = document.createElement("div");
        const JSXdom = (<GlobalMessage content={content} duration={duration} type={"success"}></GlobalMessage>);
        const thisContainer = createRoot(this.dom);
        thisContainer.render(JSXdom);
        // ReactDOM.render(JSXdom,this.dom);
        document.body.appendChild(this.dom);

    },
    error(content, duration = 2000) {
        this.dom = document.createElement("div");
        const JSXdom = (<GlobalMessage content={content} duration={duration} type={"error"}></GlobalMessage>);
        createRoot(this.dom).render(JSXdom);
        document.body.appendChild(this.dom);
    },
    warning(content, duration = 2000) {
        this.dom = document.createElement("div");
        const JSXdom = (<GlobalMessage content={content} duration={duration} type={"warning"}></GlobalMessage>);
        createRoot(this.dom).render(JSXdom);
        document.body.appendChild(this.dom);
    },
    info(content, duration = 2000) {
        this.dom = document.createElement("div");
        const JSXdom = (<GlobalMessage content={content} duration={duration} type={"info"}></GlobalMessage>);
        createRoot(this.dom).render(JSXdom);
        document.body.appendChild(this.dom);
    },
};

export default message;