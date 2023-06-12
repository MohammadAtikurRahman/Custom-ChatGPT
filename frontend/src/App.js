import "./normal.css";
import "./App.css";
import { useState, useRef, useEffect } from "react";
import Avatar from "./components/Avatar";
import NewChat from "./components/NewChat";
import NavPrompt from "./components/NavPrompt";
import Loading from "./components/Loading";
import Error from "./components/Error";
import NavLinks from "./components/NavLink";
import BotResponse from "./components/BotResponse";
import IntroSection from "./components/IntroSection";
import { useSpeechRecognition } from "react-speech-kit";
import { default as Speak } from "react-text-to-speech";
import { BsMic } from "react-icons/bs";
import axios from "axios";
import GenerateImage from "./GenerateImage";
import { BsMicFill } from "react-icons/bs";
import { BsMicMuteFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// import { MdSend } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [err, setErr] = useState(false);

  const [setIsImageGenerated] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setInputPrompt(result);
    },
  });
  // Do something with the chatbot element

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const baseurl = process.env.REACT_APP_URL;
  console.log("base url " + baseurl);

  const styles = {
    button: {
      width: "270px",
      height: "35px",
      background: "#40414F",
      color: "white",
      border: "none",
      outline: "none",
      marginBottom: "10px",
      transition: "background 0.3s",
      fontSize: "11px",
      "@media (max-width: 1280px)": {
        width: "200px", // you can adjust as you need
        height: "30px", // you can adjust as you need
        fontSize: "9px", // you can adjust as you need
      },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    setChatLog([...chatLog, { chatPrompt: inputPrompt }]);
    async function callAPI() {
      try {
        const response = await fetch(baseurl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputPrompt }),
        });
        const data = await response.json();
        setChatLog([
          ...chatLog,
          {
            chatPrompt: inputPrompt,
            botMessage: data.botResponse,
          },
        ]);
        setErr(false);
      } catch (err) {
        setErr(err);
      }
    }
    callAPI();
    setInputPrompt("");
  };

  const [showProductFaq, setShowProductFaq] = useState(true);

  const handleClick = (message) => {
    let botMessage = "";

    // Handle different messages based on the button clicked
    switch (message) {
      case "Are you an IKEA store?":
        botMessage =
          "No. We are parallel importer of genuine IKEA and other brands from overseas and do not claim to represent IKEA in New Zealand. We have the largest stock of Ikea products which we buy from Ikea stores in different parts of the world and make available to the New Zealand market. We do sell various other brands as well.";
        break;
      case "Do you sell only IKEA products?":
        botMessage =
          "No. We sell our own brand, IDIYA products as well as IKEA and other brands as well";
        break;
      case "How can I know more about a product?":
        botMessage =
          "You may check the product details by searching the product. You can also try our ChatGPT by providing product name. It will give you idea about product weight, description etc. You can also know how much it may cost for shipping if you ship to your particular postcode.";
        break;

      case "I Have Placed my order. What Happens next?":
        botMessage =
          "Our office team checks the order and confirms it , you should receive a short email confirming everything within a working day.";
        break;
      case "My order was a preorder , what's that ?":
        botMessage =
          "Preorders are products that we don’t stock but can get from overseas ( IKEA store or other brand if you ordered that brand). We collect all orders and once a month ( or sooner ) load a shipping container filled with all such orders. These take about 4 weeks to arrive our warehouse. Depending on orders South Island orders are either shipped directly to South Island or to north island warehouse first. You will receive an email once your order starts from overseas. And once again when it arrives our warehouse.";
        break;
      case "My order was back order, what’s that ?":
        botMessage =
          "Back orders are products that we stock but currently it’s not in stock. These can take as little as days ( if new shipments are on the way ) or as much as 75 days ( if new orders were just placed overseas ) You will receive an email in about 2 days giving you an idea of when to expect your order.";
        break;

      case "My order was in stock but I got an email that it’s not , what happens next ?":
        botMessage =
          "Managing thousands of products in our warehouse, due to errors/ breakages . Sometimes this happens. There could be a similar product being available ( another color / brand ) or a preorder available. You will be offered that via email within 2 working days of your order. You can choose to switch or get a refund. Just simply reply to the email. If we don’t get a reply to the email in a weeks time we straight away refund you anyways.";
        break;

      case "My order has both preorders and in stock items , what happens in this situation?":
        botMessage =
          "If you have paid for shipping once ( or free shipping ). We can cover for delivery for once only. You can choose to get your order once together or pay for additional shipping or pick up the instock items first or pick preorders later. Just reply to order confirmation email.";

      case "When will I get my items ?":
        botMessage =
          "Instock items are ready for pick up immediately. We ship using either post or our truck or third party carriers. Auckland orders should be with you within a week. North island within two weeks and South Island within 4 weeks. ( This applies to north island stock , South Island instock items get dispatched/ ready for pick up in 2 days only. )";
        break;

      case "Can I make changes to my order before receiving it ?":
        botMessage =
          "Sure you can. Just email us and we will be able to confirm the changes usually within a day or two.  ";
        break;

      case "What if I’m not there to receive my order ?":
        botMessage =
          "We will contact you before attempting delivery. If there is a dry secure place then the delivery guys leave the item there. Otherwise they bring it back and contact you to reschedule. We don’t normally charge for one more attempted delivery. It’s very rare.";
        break;

      case "How do I cancel my order before receiving ?":
        botMessage =
          "It’s simple , just email us order number. We will refund through the same method as you paid automatically ( credit card / paypal/part pay etc ) . If you paid via a bank transfer we would need a bank account number to return the funds to. Best would be to email the account number in the same email. We refund immediately and send a confirmation email.";
        break;

      case "How do I return part of the order ?":
        botMessage =
          "Simply email us what part of the order you need to return , if within 14 days and still in original packing we can arrange to pick back by post / our own delivery truck. Returns usually take a week to arrange. We refund the costs once products arrive our warehouse. There might be a return postage cost which we charge as actual.";
        break;

      case "How do I return all of the order ?":
        botMessage =
          "Within 14 days and in original packing , all orders are returnable. Simply email us and we will organise the return via post or our truck. There might be a return postage cost which we charge as actual.";
        break;

      case "My order was not as I expected , what should I do ?":
        botMessage =
          "Please email us a discriptive email preferably with photos. We will try our best to make it right for you. It might involve a compensation through a store credit or a partial cash refund or a full return and refund. But in any case we won’t stop till you are satisfied and at any time all your rights under CG act are well preserved. The only way we can grow our business is by keeping you satisfied and promoting us to your friends.";
        break;

      case "I have not received any emails from you , what’s happening?":
        botMessage =
          "Something is definitely wrong. Please email us with order number or purchase details. It might take few hours to solve such a mystery. But it has happened in past mostly due to wrong/email bouncing.";
        break;

      case "I can see some reviews for your shop mentioning lack of communication and delivery delays. How do you explain that ?":
        botMessage =
          "Just like the rest of us , we are not perfect. We endeavour our best to keep you informed and happy but at times we do fail to meet expectations. Being a relatively new field of online furniture selling , there are no benchmarks for service standards. We strive to be better than yesterday. We are a relatively medium scale business and feel pride in maintaining consumer laws and rights. We believe internet to be an open billboard for customers to put their views and reviews on . We don’t reward customers for good reviews nor we expect them to change a review after we correct or fix a problem. We should have got it right the first time and deserve a slap when we don’t. It’s just natural that when people get “ normal “ service ie all done nicely , we don’t get a review for that. This happens 99.9999% times.  It’s the times when we fail to deliver , is when a negative review is put. We learn from these experiences and fix our systems to avoid repeating the same mistakes. But these represent a very tiny portion of our overall trade.";
        break;

      case "Why are there no discounts on your website anymore?":
        botMessage =
          "We have reduced all in stock product price to clearance prices and these are now final price. Preorder prices are higher as new imports are much dearer due to rising costs. Most of in stock products when restocked will be considerably more expensive after they get out of stock.";
        break;

      case "When will my order be delivered?":
        botMessage =
          "In-stock items are ready for pick up immediately. We ship using either post or our truck or third party carriers. Auckland orders should be with you within a week. North island within two weeks and South Island within 4 weeks. (This applies to north island stock , South Island in-stock items get dispatched/ ready for pick up in 2 days only)";
        break;

      case "Can I make changes to my order before receiving it?":
        botMessage = "Can I make changes to my order before receiving it?";
        break;

      case "How do I know next available delivery date to my location?":
        botMessage =
          "You may ask ChatGPT about next available delivery date. We deliver all over New Zealand. Please let us know your postcode so that we can inform you about next delivery dates.";
        break;

      case "What if I’m not there to receive my order?":
        botMessage =
          "We will contact you before attempting delivery. If there is a dry secure place then the delivery guys leave the item there. Otherwise they bring it back and contact you to reschedule. We don’t normally charge for one more attempted delivery. It’s very rare.";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      case "1":
        botMessage = "1";
        break;

      default:
        break;
    }

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      {
        chatPrompt: message,
        botMessage: (
          <>
            <br /> <br /> {botMessage}
          </>
        ),
      },
    ]);
  };

  const API_KEY = process.env.REACT_APP_IMAGES_KEY;
  // const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState("");

  // const generateImage = async () => {
  //   if (inputPrompt.startsWith("draw")) {
  //     try {
  //       const response = await axios({
  //         method: "post",
  //         url: "https://api.openai.com/v1/images/generations",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${API_KEY}`,
  //         },
  //         data: {
  //           model: "image-alpha-001",
  //           prompt: inputPrompt,
  //           num_images: 1,
  //           size: "512x512",
  //           response_format: "url",
  //         },
  //       });
  //       setImageURL(response.data.data[0].url);
  //       setIsImageGenerated(true);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  return (
    <div className="App">
      <header>
        <div className="menu">
          <button onClick={() => setShowMenu(true)}>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#d9d9e3"
              strokeLinecap="round"
            >
              <path d="M21 18H3M21 12H3M21 6H3" />
            </svg>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        <h1 style={{ paddingRight: "40px" }}>Custom ChatGPT</h1>
      </header>
      {showMenu && (
        <nav>
          <div className="navItems">
            <NewChat setChatLog={setChatLog} setShowMenu={setShowMenu} />
            {chatLog.map(
              (chat, idx) =>
                chat.botMessage && (
                  <NavPrompt chatPrompt={chat.chatPrompt} key={idx} />
                )
            )}
          </div>
          <div className="navCloseIcon">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              xmlSpace="preserve"
              stroke="#fff"
              width={42}
              height={42}
              onClick={() => setShowMenu(false)}
            >
              <path d="m53.691 50.609 13.467-13.467a2 2 0 1 0-2.828-2.828L50.863 47.781 37.398 34.314a2 2 0 1 0-2.828 2.828l13.465 13.467-14.293 14.293a2 2 0 1 0 2.828 2.828l14.293-14.293L65.156 67.73c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L53.691 50.609z" />
            </svg>
          </div>
        </nav>
      )}

      <aside className="sideMenu">
        <NewChat setChatLog={setChatLog} setShowMenu={setShowMenu} />
        <div className="navPromptWrapper">
          {chatLog.map(
            (chat, idx) =>
              chat.botMessage && (
                <NavPrompt chatPrompt={chat.chatPrompt} key={idx} />
              )
          )}
        </div>
        {chatLog.length > 0 && (
          <NavLinks
            svg={
              <svg
                fill="#fff"
                viewBox="0 0 24 24"
                data-name="Flat Line"
                xmlns="http://www.w3.org/2000/svg"
                className="icon flat-line"
                stroke="#fff"
                width={23}
                height={23}
              >
                <path
                  d="M5 8h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5V8Z"
                  transform="rotate(90 12 14)"
                  style={{
                    fill: "#fff202022",
                    strokeWidth: 2,
                  }}
                />
                <path
                  d="M16 7V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"
                  style={{
                    fill: "none",
                    stroke: "#fff202022000000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                  }}
                />
                <path
                  data-name="primary"
                  d="M10 11v6m4-6v6M4 7h16m-2 13V7H6v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1Z"
                  style={{
                    fill: "none",
                    stroke: "#fff202022000000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                  }}
                />
              </svg>
            }
            text="Clear Conversations"
            setChatLog={setChatLog}
          />
        )}
        <NavLinks
        // svg={
        //   <svg
        //     viewBox="0 0 24 24"
        //     xmlns="http://www.w3.org/2000/svg"
        //     fill="#fff"
        //     stroke="#fff"
        //     width={25}
        //     height={25}
        //   >
        //     <title>{"discord_fill"}</title>
        //     <g stroke="none" fill="none" fillRule="evenodd">
        //       <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
        //       <path
        //         d="M15.003 4c.744 0 1.53.26 2.25.547l.527.216c1.26.528 1.968 1.636 2.517 2.853.891 1.975 1.51 4.608 1.724 6.61.102.95.127 1.906-.056 2.549-.197.687-.867 1.173-1.518 1.555l-.322.183-.334.186c-.172.096-.349.191-.525.284l-.522.27-.717.357-.577.284a1 1 0 1 1-.894-1.788l.79-.39-.58-.609c-1.39.57-3.027.893-4.766.893-1.739 0-3.376-.322-4.766-.893l-.58.608.793.39a1 1 0 1 1-.894 1.79l-.544-.27c-.402-.2-.805-.398-1.203-.607l-.928-.505-.321-.183c-.651-.382-1.322-.868-1.518-1.555-.184-.643-.158-1.598-.057-2.55.214-2.001.833-4.634 1.724-6.609.549-1.217 1.257-2.325 2.517-2.853C7.059 4.413 8.072 4 9 4c.603 0 1.077.555.99 1.147A13.65 13.65 0 0 1 12 5c.691 0 1.366.05 2.014.148A1.012 1.012 0 0 1 15.004 4ZM8.75 10.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm6.5 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
        //         fill="#fff"
        //       />
        //     </g>
        //   </svg>
        // }
        // text="OpenAI Discord"
        // link="https://discord.com/invite/openai"
        />
        <NavLinks
        // svg={
        //   <svg
        //     viewBox="0 0 24 24"
        //     xmlns="http://www.w3.org/2000/svg"
        //     fill="none"
        //     width={25}
        //     height={25}
        //   >
        //     <path
        //       stroke="#fff"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       strokeWidth={2}
        //       d="M12 6H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5m-6 0 7.5-7.5M15 3h6v6"
        //     />
        //   </svg>
        // }
        // text="Updates & FAQ"
        // link="https://help.openai.com/en/collections/3742473-chatgpt"
        />
      </aside>

      <section className="chatBox">
        <br />
        {showProductFaq && (

        <h1>FAQ Categories</h1>

        )
}
        {showProductFaq && (
          <p style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <h3>
                <FontAwesomeIcon icon={faShoppingCart} /> Product FAQ
              </h3>

              <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("Are you an IKEA store?");
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    Are you an IKEA store?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("Do you sell only IKEA products?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    Do you sell only IKEA products?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("How can I know more about a product?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    How can I know more about a product?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                {/* Add more buttons here */}
              </ul>
            </div>

            <div>
              <h3>
                <FontAwesomeIcon icon={faClipboardList} /> Order FAQ
              </h3>

              <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("I Have Placed my order. What Happens next?");
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    I Have Placed my order. What Happens next?
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("My order was a preorder , what's that ?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    My order was a preorder. what's that ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("My order was back order, what’s that ?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    My order was back order, what’s that ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "My order was in stock but I got an email that it’s not , what happens next ?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    My order was in stock but I got an email that it’s not ,
                    what happens next ? <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "My order has both preorders and in stock items , what happens in this situation?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    My order has both preorders and in stock items , what
                    happens in this situation?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("When will I get my items ?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    When will I get my items ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "Can I make changes to my order before receiving it ?"
                      );

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    Can I make changes to my order before receiving it ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3>
                <FontAwesomeIcon icon={faTruck} /> Order FAQ
              </h3>

              <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "What if I’m not there to receive my order ?"
                      );

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    What if I’m not there to receive my order ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "How do I cancel my order before receiving ?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    How do I cancel my order before receiving ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("How do I return part of the order ?");
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    How do I return part of the order ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("How do I return all of the order ?");

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    How do I return all of the order ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "My order was not as I expected , what should I do ?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    My order was not as I expected , what should I do ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "I have not received any emails from you , what’s happening?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    I have not received any emails from you , what’s happening?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "I can see some reviews for your shop mentioning lack of communication and delivery delays. How do you explain that ?"
                      );

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    I can see some reviews for your shop mentioning lack of
                    communication and delivery delays. How do you explain that ?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "Why are there no discounts on your website anymore?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    Why are there no discounts on your website anymore?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3>
                <FontAwesomeIcon icon={faTruck} /> Delivery FAQ
              </h3>

              <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("When will my order be delivered?");
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    When will my order be delivered?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "Can I make changes to my order before receiving it?"
                      );

                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    Can I make changes to my order before receiving it?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick(
                        "How do I know next available delivery date to my location?"
                      );
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    How do I know next available delivery date to my location?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>

                <li>
                  <button
                    style={{
                      width: "270px",

                      height: "35px",
                      background: "#40414F",
                      color: "white",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                      transition: "background 0.3s",
                      fontSize: "11px",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      handleClick("What if I’m not there to receive my order?");
                      setShowProductFaq(false);
                    }}
                    onMouseOver={(e) => (e.target.style.background = "black")}
                    onMouseOut={(e) => (e.target.style.background = "#40414F")}
                  >
                    What if I’m not there to receive my order?{" "}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </li>
              </ul>
            </div>
          </p>
        )}

        {chatLog.length > 0 ? (
          <div className="chatLogWrapper">
            {chatLog.length > 0 &&
              chatLog.map((chat, idx) => (
                <div className="chatLog" key={idx}>
                  <div className="chatPromptMainContainer">
                    <div className="chatPromptWrapper">
                      <Avatar bg="#5437DB" className="userSVG">
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth={1.9}
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          height={40}
                          width={40}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx={12} cy={7} r={4} />
                        </svg>
                      </Avatar>
                      <div id="chatPrompt">{chat.chatPrompt}</div>
                    </div>
                  </div>
                  <div className="botMessageMainContainer">
                    <div className="botMessageWrapper">
                      <Avatar bg="#11a27f" className="openaiSVG">
                        <svg
                          width={41}
                          height={41}
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          strokeWidth={1.5}
                          className="h-6 w-6"
                        >
                          <path
                            d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Avatar>
                      {chat.botMessage ? (
                        <div id="botMessage" ref={messagesEndRef}>
                          <BotResponse response={chat.botMessage} />
                          {showMessage && <div id="messageBox">{message}</div>}
                          <Speak
                            text={chat.botMessage}
                            startBtn={
                              <button className="micPosition">
                                <BsMicFill />{" "}
                              </button>
                            }
                            stopBtn={
                              <button className="micPosition">
                                <BsMicMuteFill />
                              </button>
                            }
                          />
                        </div>
                      ) : (
                        <Loading />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <IntroSection />
        )}
        <form onSubmit={handleSubmit}>
          <div className="inputPromptWrapper">
            <input
              name="inputPrompt"
              autoComplete="off"
              id=""
              className="inputPrompttTextarea"
              type="text"
              rows="1"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              autoFocus
            ></input>
            <button
              className="recording-button"
              type="button"
              onMouseDown={listen}
              onMouseUp={stop}
              style={{
                backgroundColor: "#41414E",
                color: "white",
                border: 0,
                padding: "4px 22px",
                textAlign: "center",
                fontSize: "16px",
                transform: "translateX(-120px)",
              }}
            >
              <BsMic />
            </button>
       
       
       
            <button
  className="send-button"
  type="submit"
  style={{
    backgroundColor: "#41414E",
    color: "white",
    border: 0,
    padding: "4px 22px",
    textAlign: "center",
    fontSize: "16px",
    transform: "translateX(-132px)",
  }}
  onClick={() => setShowProductFaq(false)}
>
  <IoSendSharp/>
</button>

            <p></p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default App;
