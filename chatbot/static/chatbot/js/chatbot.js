document.addEventListener("DOMContentLoaded", () => {

    const widget = document.getElementById('chatWidget');
    const card = document.getElementById('chatCard');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const toggleSizeBtn = document.getElementById('toggleSizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const faqBtn = document.getElementById('faqBtn');

    // initial state
    let expanded = false;
    let minimized = true;

    // toggle minimize / restore
    function toggleMinimize() {
        minimized = !minimized;
        widget.classList.remove('expanded');
        widget.classList.toggle('minimized', minimized);
        card.classList.toggle('open', !minimized);
        if (!minimized) {
            // scroll to bottom when opening
            setTimeout(() => messages.scrollTop = messages.scrollHeight, 120);
            messageInput.focus();
        }
    }
    minimizeBtn.addEventListener('click', toggleMinimize);

    // toggle expanded wide
    toggleSizeBtn.addEventListener('click', () => {
        if (minimized) {
            card.classList.toggle('open', !minimized);
            minimized = false;
            widget.classList.remove('minimized');
            card.classList.add('open');
        } else {
            expanded = !expanded;
            widget.classList.toggle('expanded', expanded);
        }
        // when expanded, also remove minimized
        if (expanded) {
            minimized = false; widget.classList.remove('minimized');
            card.classList.add('open');
        }
    });

    // close button hides widget (you can provide a reopen button in your real app)
    closeBtn.addEventListener('click', () => {
        widget.style.display = 'none';
        // Add a small programmatic reopen after 1s for demo (in prod, you'll have a floating launcher)
        setTimeout(() => {
            widget.style.display = ''; // show again (demo). Remove this in production.
        }, 1000);
    });

    // message sending: append user bubble, then dummy bot reply
    function appendUserMessage(text) {
        const row = document.createElement('div'); row.className = 'msg-row user';
        const avatar = document.createElement('div'); avatar.className = 'bot-avatar-small'; avatar.style.background = 'linear-gradient(180deg,#fff,#fff)';
        // avatar.innerHTML = `<img src="https://via.placeholder.com/36" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover"/>`;
        avatar.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="12" cy="6" r="4" />
                                        <path
                                            d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                                    </g>
                                </svg>`;
        const container = document.createElement('div');
        const bubble = document.createElement('div'); bubble.className = 'bubble user'; bubble.innerText = text;
        const ts = document.createElement('span'); ts.className = 'ts'; ts.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        container.appendChild(bubble); container.appendChild(ts);
        row.appendChild(container); row.appendChild(avatar);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    function appendBotMessage(text) {
        const row = document.createElement('div'); row.className = 'msg-row bot';
        const avatar = document.createElement('div'); avatar.className = 'bot-avatar-small';
        avatar.innerHTML = `<svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                                    <circle cx="37.5" cy="37.5" r="37.5" fill="#FED555" />
                                    <mask id="mask0_13_3" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                                        width="76" height="76">
                                        <circle cx="37.6739" cy="37.6739" r="37.6319" fill="#FED555" />
                                    </mask>
                                    <g mask="url(#mask0_13_3)">
                                        <ellipse cx="18.7478" cy="18.7489" rx="18.7478" ry="18.7489"
                                            transform="matrix(-0.666195 -0.745778 0.746016 -0.665927 56.5292 45.9875)"
                                            fill="#FFF200" />
                                        <ellipse cx="18.7478" cy="18.7489" rx="18.7478" ry="18.7489"
                                            transform="matrix(-0.666195 -0.745778 0.746016 -0.665927 60.9584 42.0338)"
                                            fill="#FED555" />
                                        <ellipse cx="2.9685" cy="2.96848" rx="2.9685" ry="2.96848"
                                            transform="matrix(-1.00013 0.00922206 -0.00920934 -0.99978 54.7185 28.2584)"
                                            fill="#FFF200" />
                                        <ellipse cx="18.7478" cy="18.7489" rx="18.7478" ry="18.7489"
                                            transform="matrix(0.666195 0.745778 -0.746016 0.665927 19.5392 30.0893)"
                                            fill="#52CD52" />
                                        <ellipse cx="18.7478" cy="18.7489" rx="18.7478" ry="18.7489"
                                            transform="matrix(0.666195 0.745778 -0.746016 0.665927 15.1102 34.043)"
                                            fill="#FED555" />
                                        <ellipse cx="2.9685" cy="2.96848" rx="2.9685" ry="2.96848"
                                            transform="matrix(1.00013 -0.00922206 0.00920934 0.99978 21.3499 47.8183)"
                                            fill="#52CD52" />
                                        <ellipse cx="18.7489" cy="18.7478" rx="18.7489" ry="18.7478"
                                            transform="matrix(-0.746016 0.665927 -0.666194 -0.745778 45.3097 19.7647)"
                                            fill="#529BCD" />
                                        <ellipse cx="18.7489" cy="18.7478" rx="18.7489" ry="18.7478"
                                            transform="matrix(-0.746016 0.665927 -0.666194 -0.745778 41.3542 15.3371)"
                                            fill="#FED555" />
                                        <ellipse cx="2.96848" cy="2.9685" rx="2.96848" ry="2.9685"
                                            transform="matrix(0.00920933 0.99978 -1.00013 0.00922206 27.574 21.5751)"
                                            fill="#52B4CD" />
                                        <ellipse cx="18.7489" cy="18.7478" rx="18.7489" ry="18.7478"
                                            transform="matrix(0.746016 -0.665927 0.666195 0.745778 30.5294 56.3786)"
                                            fill="#FF0206" />
                                        <ellipse cx="18.7489" cy="18.7478" rx="18.7489" ry="18.7478"
                                            transform="matrix(0.746016 -0.665927 0.666195 0.745778 34.4845 60.8061)"
                                            fill="#FED555" />
                                        <ellipse cx="2.96848" cy="2.9685" rx="2.96848" ry="2.9685"
                                            transform="matrix(-0.00920934 -0.99978 1.00013 -0.00922206 48.265 54.5682)"
                                            fill="#FF0004" />
                                    </g>
                                </svg>`;
        const container = document.createElement('div');
        const bubble = document.createElement('div'); bubble.className = 'bubble bot'; bubble.innerText = text;
        const ts = document.createElement('span'); ts.className = 'ts'; ts.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        container.appendChild(bubble); container.appendChild(ts);
        row.appendChild(avatar); row.appendChild(container);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    // Send button handler
    sendBtn.addEventListener('click', async () => {
        const txt = messageInput.value.trim();
        if (!txt) return;

        // append user message
        appendUserMessage(txt);
        messageInput.value = '';

        // show "thinking" loader
        const loader = document.createElement('div');
        loader.className = 'msg-row bot';
        loader.innerHTML = `
            <div class="bot-avatar-small" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#0b2b45"/>
                </svg>
            </div>
            <div>
                <div class="bubble bot">...</div>
            </div>`;
        messages.appendChild(loader);
        messages.scrollTop = messages.scrollHeight;

        try {
            // send message to Django API
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: txt })
            });

            const data = await res.json();

            // remove loader and append bot response
            loader.remove();
            appendBotMessage(data.response || 'Oops! No response from server.');
            messages.scrollTop = messages.scrollHeight;

        } catch (err) {
            loader.remove();
            appendBotMessage('Error: could not reach server.');
            console.error(err);
        }
    });

    // press Enter to send
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // FAQ button: show small quick replies
    faqBtn.addEventListener('click', () => {
        appendUserMessage('Show FAQs');
        setTimeout(() => {
            appendBotMessage('FAQs:\n 1) What is POSH training?\n  2) How often to retrain?\n  (This is demo content.)');
        }, 350);
    });

    /* Accessibility: allow focusing the widget with keyboard */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // collapse if expanded, else minimize
            if (expanded) {
                toggleSizeBtn.click();
            } else {
                if (!minimized) minimizeBtn.click();
            }
        }
    });

    // modules panel 

    const modulesPanel = document.getElementById('modulesPanel');

    // Fake API call for demo
    async function fetchModules() {
        // In real life: const res = await fetch('/api/modules/');
        // return res.json();
        return [
            { id: 1, title: "POSH Training", status: "not_started" },
            { id: 2, title: "Python", status: "completed" },
            { id: 3, title: "Communication", status: "in_progress" }
        ];
    }

    // Render modules
    function renderModules(mods) {
        modulesPanel.innerHTML = '';
        mods.forEach(m => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `
                            <div class="module-info">
                                <span class="module-title">${m.title}</span>
                                <span class="module-status">${statusLabel(m.status)}</span>
                            </div>
                            <div class="module-action">${actionLabel(m.status)}</div>
                            `;
            card.addEventListener('click', () => selectModule(m));
            modulesPanel.appendChild(card);
        });
    }

    // Status labels
    function statusLabel(s) {
        switch (s) {
            case 'not_started': return 'Not started';
            case 'in_progress': return 'In progress';
            case 'completed': return 'Completed';
            default: return s;
        }
    }
    function actionLabel(s) {
        if (s === 'not_started') return 'Start Training';
        if (s === 'in_progress') return 'Resume';
        if (s === 'completed') return 'Retake Test';
        return 'Open';
    }

    // When module chosen
    function selectModule(mod) {
        console.log(mod);
        appendUserMessage(`Selected: ${mod.title}`);
        currentModule = mod;
        qaMode = false;
        appendBotMessage(`Choose an option for <b>${mod.title}</b>:`);
        showModuleMenu(mod);
    }

    // Hook: FAQ button now shows module list instead
    faqBtn.removeEventListener('click', () => { });
    faqBtn.addEventListener('click', async () => {
        appendBotMessage('Fetching available modules...');
        const mods = await fetchModules();
        renderModules(mods);
        showModules();
    });

    let currentModule = null;

    // Fake API: training content
    async function fetchTrainingContent(moduleId) {
        // Replace with real API call: `/api/module/${moduleId}/content/`
        if (moduleId === 1) {
            return [
                { type: 'text', value: "Welcome to POSH Training. This module will cover the basics of the POSH Act." },
                { type: 'image', value: "https://cdn.britannica.com/47/246247-050-F1021DE9/AI-text-to-image-photo-robot-with-computer.jpg" },
                { type: 'text', value: "The POSH Act mandates prevention and redressal of sexual harassment at the workplace." }
            ];
        }
        return [{ type: 'text', value: "Training content coming soon..." }];
    }

    // Render training inside chat
    async function startTraining(mod) {
        currentModule = mod;
        showMessages();
        appendBotMessage(`Starting training for <b>${mod.title}</b>...`);

        const content = await fetchTrainingContent(mod.id);
        for (const block of content) {
            if (block.type === 'text') {
                appendBotMessage(block.value);
            } else if (block.type === 'image') {
                const div = document.createElement('div');
                div.className = 'training-block';
                div.innerHTML = `<img src="${block.value}" alt="Training image"/>`;
                messages.appendChild(div);
            }
        }

        // Add "Mark complete" button
        const actions = document.createElement('div');
        actions.className = 'training-actions';
        actions.innerHTML = `<button class="btn-complete">Mark Training Complete</button>`;
        actions.querySelector('button').addEventListener('click', () => completeTraining(mod.id));
        messages.appendChild(actions);
        messages.scrollTop = messages.scrollHeight;
    }

    // Complete training
    async function completeTraining(moduleId) {
        appendUserMessage("✅ Training Completed");
        // Real API call:
        // await fetch(`/api/module/${moduleId}/complete_training/`,{method:'POST'});
        appendBotMessage("Great job! Training marked complete. You can now attempt the test anytime.");
        // Here we could set mod.status='completed' and refresh module list if needed
    }

    // Hook FAQ to module list
    faqBtn.addEventListener('click', async () => {
        appendBotMessage('Fetching available modules...');
        const mods = await fetchModules();
        renderModules(mods);
        showModules();
    });

    // test after training 

    let testState = null;

    // Fake API: start test
    async function startTest(moduleId) {
        // Replace with real API call: /api/module/${moduleId}/start_test/
        return [
            { id: 101, question: "What does POSH stand for?", options: ["Prevention of Social Harassment", "Prevention of Sexual Harassment", "Policy on Staff Harassment", "Protection of Staff & HR"], correct: "B" },
            { id: 102, question: "Which of these is sexual harassment?", options: ["Unwelcome physical contact", "Sexually colored remarks", "Demand for favors", "All of the above"], correct: "D" },
            { id: 103, question: "Who can file a complaint?", options: ["Only female employees", "Any aggrieved woman", "Only permanent staff", "Only contractual staff"], correct: "B" }
        ];
    }

    // Start test flow
    async function launchTest(mod) {
        appendBotMessage(`Starting test for <b>${mod.title}</b>.`);
        const questions = await startTest(mod.id);

        testState = {
            moduleId: mod.id,
            index: 0,
            questions: questions,
            answers: []
        };
        askNextQuestion();
    }

    // Ask next question
    function askNextQuestion() {
        if (!testState) return;
        if (testState.index >= testState.questions.length) {
            finishTest();
            return;
        }
        const q = testState.questions[testState.index];
        appendBotMessage(`<b>Q${testState.index + 1}:</b> ${q.question}`);

        const block = document.createElement('div');
        block.className = 'options-block';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.addEventListener('click', () => selectAnswer(q, i));
            block.appendChild(btn);
        });
        messages.appendChild(block);
        messages.scrollTop = messages.scrollHeight;
    }

    // Handle answer
    function selectAnswer(q, choiceIndex) {
        const choiceLetter = ['A', 'B', 'C', 'D'][choiceIndex];
        appendUserMessage(`${choiceLetter}. ${q.options[choiceIndex]}`);

        testState.answers.push({
            questionId: q.id,
            selected: choiceLetter
        });

        testState.index++;
        askNextQuestion();
    }

    // Finish test
    async function finishTest() {
        appendBotMessage("Submitting your answers...");
        // Fake scoring
        let score = 0;
        testState.questions.forEach((q, i) => {
            const ans = testState.answers[i];
            if (ans && ans.selected === q.correct) score++;
        });
        const total = testState.questions.length;
        const percent = Math.round((score / total) * 100);
        const passed = percent >= 70;

        // Real API call: POST /api/module/${testState.moduleId}/submit_test/
        // with testState.answers

        const box = document.createElement('div');
        box.className = 'score-box';
        box.innerHTML = `Score: ${score}/${total} (${percent}%)<br>
                    Result: ${passed ? "✅ Passed" : "❌ Failed"}`;
        messages.appendChild(box);
        messages.scrollTop = messages.scrollHeight;

        testState = null;
    }

    // qa mode 
    let qaMode = false;

    // Dummy Q&A API
    async function askQuestion(moduleId, text) {
        // Later → real API: /api/module/${moduleId}/ask/
        return `🤖 (dummy) You asked: "${text}". I'll fetch proper answers later.`;
    }

    // Handle input send
    sendBtn.addEventListener('click', async () => {
        const text = msgInput.value.trim();
        if (!text) return;
        appendUserMessage(text);
        msgInput.value = '';

        if (qaMode && currentModule) {
            const reply = await askQuestion(currentModule.id, text);
            appendBotMessage(reply);
        } else {
            appendBotMessage("⚠️ Please select a module and an action first.");
        }
    });

    // Module action menu
    function showModuleMenu(mod) {
        showMessages();

        const div = document.createElement('div');
        div.className = 'action-buttons';
        [
            { label: "📖 Training", action: () => startTraining(mod) },
            { label: "📝 Test", action: () => launchTest(mod) },
            { label: "💬 Questions", action: () => enterQAMode(mod) }
        ].forEach(btnData => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerText = btnData.label;
            btn.onclick = () => {
                div.remove();
                btnData.action();
                // no need to call showMessages() here again
            };
            div.appendChild(btn);
        });

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Switch views
    function showModules() {
        messages.style.display = 'none';
        modulesPanel.style.display = 'flex';
        document.getElementById('chatInput').style.display = 'none';
    }
    function showMessages() {
        messages.style.display = 'flex';
        modulesPanel.style.display = 'none';
        document.getElementById('chatInput').style.display = 'flex';
    }


    // Enter Q&A mode
    function enterQAMode(mod) {
        qaMode = true;
        appendBotMessage(`You can now ask me questions about <b>${mod.title}</b>.`);
    }

});