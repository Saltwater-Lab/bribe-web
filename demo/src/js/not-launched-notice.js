var dismissed;

if (!dismissed || dismissed.length < 1) {
  if (!localStorage.getItem('dismissed')) {
    localStorage.setItem('dismissed', 'false');
  }
} else {
  localStorage.setItem('dismissed', dismissed);
}
dismissed = localStorage.getItem('dismissed');

!dismissed || dismissed === "false" ? (
  openNotice(`$BRIBE token is not launched yet.<br>Official token address will be announced soon.`, false)) : (localStorage.setItem('dismissed', dismissed))

function doNotShowAgain() {
  localStorage.setItem('dismissed', 'true');
  closeNotice()
}

function closeNotice() {
  document.querySelectorAll(".notification-alert-parent").forEach(function (e) {
    e.classList.add("closed")
  })
  document.body.classList.remove("noscroll")

}

function openNotice(t, p) {
  p = !p ? `` : `<a class="btn sec" onclick="doNotShowAgain()">No not show again</a>`;
  var n = document.createElement("div");
  n.classList.add("notification-alert-parent")


  n.innerHTML = `<div class="notification-alert"><span style="font-size: 2rem;box-shadow: 0 1px 0 0 #111;padding-bottom: 1rem;color: var(--red);"><span><i class="fas fa-exclamation-circle"></i>&nbsp;Notice</span></span>
  <span class="text">${t}</span>
  <div class="-btn-flex">
  <a class="btn primary" onclick="closeNotice()">Dismiss</a>
  ${p}
  </div>
  </div>
  `;

  var z = 99;
  var t = 20;
  document.querySelectorAll(".notification-basic").forEach(function (e) {
    !e.classList.contains("closed") && (
      z++,
      t = t+20,
      n.style['z-index'] = z,
      n.style.top = `${t}px`
    )  
  })

  document.getElementById("app").append(n);
  document.body.classList.add("noscroll")
}
