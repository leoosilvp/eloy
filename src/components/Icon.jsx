import { useRef, useState, useEffect } from "react";
import { useModal } from "../hook/useModal";
import logo from '../assets/svg/logo-light.svg';
import logoDark from '../assets/svg/logo-dark.svg';
import '../css/chat-eloy.css';
import { useTheme } from "../hook/ThemeContext";

const Icon = () => {
    const { isOpen, openModal, closeModal } = useModal();
    const modalRef = useRef(null);
    const optionsRef = useRef(null);
    const contentRef = useRef(null);

    const { theme } = useTheme();

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chat_eloy");
        return saved ? JSON.parse(saved) : [];
    });

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
        }
    };

    useEffect(() => {
        const handleClickOutsideOptions = (e) => {
            if (showOptions && optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideOptions);
        return () => document.removeEventListener("mousedown", handleClickOutsideOptions);
    }, [showOptions]);

    const enviarMensagem = async () => {
        if (!input.trim()) return;

        const userMessage = { from: "user", text: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        localStorage.setItem("chat_eloy", JSON.stringify(newMessages));
        setInput("");
        setLoading(true);

        try {
            const contexto = newMessages
                .slice(-10)
                .map(m => `${m.from === "user" ? "Usuário" : "Eloy"}: ${m.text}`)
                .join("\n");

            console.debug("📤 Enviando:", input);
            console.debug("🧠 Contexto:", contexto);

            const res = await fetch("https://eloychatbot.onrender.com/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensagem: input,
                    contexto
                })
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("❌ Erro HTTP:", res.status, text);
                throw new Error(`Servidor respondeu com ${res.status}`);
            }

            const data = await res.json();
            const botText = data.resposta ?? data.message ?? data.answer ?? "Erro ao receber resposta";

            const botMessage = { from: "eloy", text: botText };
            const updated = [...newMessages, botMessage];

            setMessages(updated);
            localStorage.setItem("chat_eloy", JSON.stringify(updated));
        } catch (err) {
            console.error("⚠️ Erro no envio:", err);
            const errorMessage = { from: "eloy", text: "Erro de conexão" };
            const updated = [...newMessages, errorMessage];
            setMessages(updated);
            localStorage.setItem("chat_eloy", JSON.stringify(updated));
        } finally {
            setLoading(false);
        }
    };


    const apagarChat = () => {
        localStorage.removeItem("chat_eloy");
        setMessages([]);
        setShowOptions(false);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <section>
            <article onClick={openModal} className='btn-chat-eloy'>
                <img src={theme === "light" ? logoDark : logo} title="Conversar com eloy" />
            </article>

            {isOpen && (
                <section className="ctn-chat-eloy" onClick={handleClickOutside}>
                    <section className="chat-eloy" ref={modalRef}>
                        <div className="header-chat-eloy">
                            <h1>eloy - chat</h1>
                            <section className="btns-header-chat-eloy">
                                <button onClick={closeModal}>
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                                <button onClick={() => setShowOptions(prev => !prev)}>
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                            </section>

                            {showOptions && (
                                <section className="ctn-options-chat-eloy" ref={optionsRef}>
                                    <button>
                                        <i className="fa-solid fa-book-open"></i>
                                        Documentação
                                    </button>
                                    <button onClick={apagarChat}>
                                        <i className="fa-regular fa-trash-can"></i>
                                        Apagar conversa
                                    </button>
                                </section>
                            )}
                        </div>

                        <section className="content-chat-eloy" ref={contentRef}>
                            {messages.length === 0 ? (
                                <div className="no-chat-eloy">
                                    <i className="fa-regular fa-comments"></i>
                                    <h2>Nenhuma conversa com eloy.</h2>
                                    <p>Faça uma pergunta e descubra o que temos de melhor para oferecer!</p>
                                </div>
                            ) : (
                                <div className="chat-messages">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`message ${msg.from}`}>
                                            <span>{msg.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="ctn-input-chat-eloy">
                            <textarea
                                placeholder={loading ? "eloy está pensando.." : "Pergunte para eloy"}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        enviarMensagem();
                                    }
                                }}
                            />
                            <section className="send-message-chat-eloy">
                                <div className="btn-left-chat-eloy">
                                    <button><i className="fa-regular fa-image"></i></button>
                                    <button><i className="fa-solid fa-link"></i></button>
                                    <button><i className="fa-regular fa-face-smile"></i></button>
                                </div>
                                <div className="btn-right-chat-eloy">
                                    <button
                                        className="send-btn"
                                        onClick={enviarMensagem}
                                        disabled={loading}
                                    >
                                        {loading ? "Pensando..." : "Enviar"}
                                    </button>
                                </div>
                            </section>
                        </section>
                    </section>
                </section>
            )}
        </section>
    );
};

export default Icon;
