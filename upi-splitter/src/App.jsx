import UPISplitter from "./UPISplitter";
import "./App.css";

function App() {
  return (
    <>
      <UPISplitter />

      <div className="social-links">
        <a
          href="https://github.com/kamal-stark-dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <i className="ri-github-fill"></i>
        </a>
        <a
          href="https://x.com/kamal_stark_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
        >
          <i className="ri-twitter-x-fill"></i>
        </a>
        <a
          href="https://linkedin.com/in/kamalveer-singh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="ri-linkedin-box-fill"></i>
        </a>
      </div>
    </>
  );
}

export default App;
