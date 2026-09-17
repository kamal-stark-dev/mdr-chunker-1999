import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "./assets/logo.png";

const MAX_CHUNK = 1999;

function splitAmount(total) {
  const chunks = [];
  let remaining = Math.round(total * 100) / 100;
  while (remaining > 0) {
    const chunk = Math.min(MAX_CHUNK, remaining);
    chunks.push(Math.round(chunk * 100) / 100);
    remaining = Math.round((remaining - chunk) * 100) / 100;
  }
  return chunks;
}

function buildUpiUri(pa, pn, amount) {
  const params = new URLSearchParams({
    pa,
    pn,
    am: amount.toFixed(2),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

export default function UPISplitter() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [pa, setPa] = useState("");
  const [pn, setPn] = useState("");
  const [amount, setAmount] = useState("");
  const [chunks, setChunks] = useState([]);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleGenerate = () => {
    setError("");
    const vpaRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    const total = parseFloat(amount);

    if (!vpaRegex.test(pa))
      return setError("Enter a valid UPI ID, like name@okhdfcbank");
    if (!pn.trim()) return setError("Enter the account holder name");
    if (!total || total <= 0) return setError("Enter an amount greater than 0");

    const amounts = splitAmount(total);
    setChunks(
      amounts.map((amt) => ({ amount: amt, uri: buildUpiUri(pa, pn, amt) })),
    );
  };

  const handleCopy = (uri, idx) => {
    navigator.clipboard.writeText(uri);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="page">
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <i className="ri-moon-line" style={{ fontSize: "1.1rem" }}></i>
        ) : (
          <i className="ri-sun-line" style={{ fontSize: "1.1rem" }}></i>
        )}
      </button>

      <div className="layout">
        <div className="panel panel-form">
          <div className="header-wrapper">
            <div className="ticket-header">
              <h1>Split the bill</h1>
              <p>
                Enter the full amount — it comes back as separate UPI tickets,
                each ₹{MAX_CHUNK} or under.
              </p>
            </div>

            <div className="logo-slot">
              <img
                src={logo}
                alt="Logo"
                className="logo"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          </div>

          <div className="perforation" />

          <div className="form">
            <label>
              UPI ID
              <input
                type="text"
                placeholder="gillbates@oksbi"
                value={pa}
                onChange={(e) => setPa(e.target.value)}
              />
            </label>
            <label>
              Account holder name
              <input
                type="text"
                placeholder="Gill Bates"
                value={pn}
                onChange={(e) => setPn(e.target.value)}
              />
            </label>
            <label>
              Total amount
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </label>
            {error && <p className="error">{error}</p>}
            <button className="generate-btn" onClick={handleGenerate}>
              Generate tickets
            </button>
          </div>
        </div>

        <div className="panel panel-stubs">
          {chunks.length === 0 ? (
            <div className="stubs-empty">
              <p>
                Your split QR tickets will show up here once you generate them.
              </p>
            </div>
          ) : (
            <>
              <p className="results-count">
                {chunks.length} ticket{chunks.length > 1 ? "s" : ""}
              </p>
              <div className="stubs">
                {chunks.map((c, i) => (
                  <div key={i} className="stub">
                    <div className="stub-qr">
                      <QRCodeSVG
                        value={c.uri}
                        size={128}
                        fgColor="var(--ink)"
                        bgColor="transparent"
                      />
                    </div>
                    <div className="stub-info">
                      <span className="stub-part">
                        Part {i + 1} of {chunks.length}
                      </span>
                      <span className="stub-amount">
                        ₹{c.amount.toFixed(2)}
                      </span>
                      <span className="stub-payee">{pn}</span>
                      <button
                        className="copy-btn"
                        onClick={() => handleCopy(c.uri, i)}
                      >
                        {copiedIdx === i ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
