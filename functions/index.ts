export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // POST /api/submit → store in KV
    if (path === "/api/submit" && request.method === "POST") {
      const name = await request.text();
      const submittedAt = new Date().toISOString();
      const record = { name, submittedAt };
      const key = `submission:${Date.now()}`;
      await env.SUBMISSIONS_KV.put(key, JSON.stringify(record));
      return new Response(
        JSON.stringify({ message: `Thanks, ${name}!` }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const files = {
      '/': { content: html, type: 'text/html' },
      '/style.css': { content: css, type: 'text/css' },
      '/main.js': { content: js, type: 'application/javascript' },
    };

    const file = files[path] || files['/'];
    return new Response(file.content, {
      headers: { 'Content-Type': file.type },
    });
  },
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ResumeCraft AI</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main>
    <h1>ResumeCraft AI</h1>
    <h2>Craft Your Future with Intelligent Precision</h2>
    <pre>✅ You&#39;re ready to deploy your MVP!</pre>

    <form id="userForm">
      <input name="name" placeholder="Your name" required />
      <button type="submit">Submit</button>
    </form>
    <p id="responseMsg"></p>

    <button onclick="sayHi()">Try Me</button>
  </main>
  <script src="/main.js"></script>
</body>
</html>`;
const css = `
body {
  font-family: system-ui, sans-serif;
  background: #f8fafc;
  margin: 0;
  padding: 2rem;
  color: #111827;
}
main {
  text-align: center;
}
h1 {
  color: #2563eb;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 1rem;
  display: block;
  width: 200px;
  margin-inline: auto;
}
`;
const js = `
function sayHi() {
  alert("Hello from ResumeCraft AI!");
}

document.querySelector('#userForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const res = await fetch('/api/submit', {
    method: 'POST',
    body: name,
  });
  const data = await res.json();
  document.querySelector('#responseMsg').textContent = data.message;
});
`;
