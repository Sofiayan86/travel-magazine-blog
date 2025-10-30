const form = document.querySelector('[data-admin-form]');
const logOutput = document.querySelector('[data-log-output]');

function appendLog(message) {
  const time = new Date().toLocaleTimeString();
  logOutput.innerHTML += `\n[${time}] ${message}`;
  logOutput.scrollTop = logOutput.scrollHeight;
}

async function triggerWorkflow(payload) {
  const { repo, workflow, token, ...inputs } = payload;
  const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`;

  appendLog('Sending workflow_dispatch request...');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs
    })
  });

  if (response.status === 204) {
    appendLog('Workflow dispatched successfully. 請到 GitHub Actions 查看執行狀態。');
  } else {
    const text = await response.text();
    appendLog(`Workflow dispatch failed: ${response.status} ${text}`);
  }
}

if (form && logOutput) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    logOutput.textContent = '';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.token) {
      appendLog('請輸入 GitHub Personal Access Token');
      return;
    }

    if (!payload.repo.includes('/')) {
      appendLog('存放庫格式應為 owner/repo');
      return;
    }

    payload.gpxFile = payload.gpxFile || '';
    payload.lat = payload.lat || '';
    payload.lng = payload.lng || '';

    appendLog('Dispatching workflow...');
    try {
      await triggerWorkflow(payload);
    } catch (error) {
      appendLog(`發生錯誤：${error.message}`);
    }
  });
}
