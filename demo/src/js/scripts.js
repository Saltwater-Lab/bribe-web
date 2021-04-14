window.demo = true;
// Enables demo-only triggers


document.querySelectorAll(".option-dropdown").forEach(function (e) {
  e.querySelectorAll(".options").length == 1
    && e.querySelectorAll(".options")[0].querySelectorAll('label').length > 0
    && e.querySelectorAll(".current-choice").length == 1 && (
      e.querySelectorAll(".options")[0].querySelectorAll('.active').length < 1 && (
        e.querySelectorAll(".options")[0].querySelectorAll('label')[0].classList.add("active")
      ),
      e.querySelectorAll(".current-choice")[0].innerHTML = `${e.querySelectorAll(".options")[0].querySelectorAll('.active')[0].innerHTML}&nbsp;<i class="fas fa-caret-down -p-l-5"></i>`,
      e.querySelectorAll(".current-choice").forEach(function (c) {
        c.addEventListener("click", function (h) {
          h.preventDefault()
          h.stopPropagation();
          h.currentTarget.parentNode.querySelectorAll(".options")[0].classList.contains("open") ? (
            h.currentTarget.parentNode.querySelectorAll(".options")[0].classList.remove("open")
          ) : (
            h.currentTarget.parentNode.querySelectorAll(".options")[0].classList.add("open")
          )
        })
      }),
      e.querySelectorAll(".options")[0].querySelectorAll('label').forEach(function (l) {
        l.addEventListener("click", function (v) {
          v.preventDefault()
          v.stopPropagation();
          var component = v.currentTarget.parentNode.parentNode.getAttribute("id");
          var chosen = v.currentTarget.parentNode.parentNode.querySelectorAll(".current-choice")[0];
          var choice = !v.currentTarget.hasAttribute("payload") ? v.currentTarget.innerHTML : processPayload(v.currentTarget.getAttribute("payload"));
          var value = v.currentTarget.getAttribute("value");
          v.currentTarget.parentNode.querySelectorAll("label").forEach(function (t) {
            t.classList.remove("active");
          });
          v.currentTarget.classList.add("active");
          chosen.innerHTML = `${choice} <i class="fas fa-caret-down -p-l-5"></i>`;
          window[component] = value;
          v.currentTarget.parentNode.classList.remove("open");
          coinUI()
        })
      })
    )
})

function coinUI() {
  document.querySelectorAll(".processed-coin-view").forEach(function (e) {
    e.parentNode.querySelectorAll(".current-choice").length > 1 && (
      String(e.innerHTML) !== String(`${e.parentNode.querySelectorAll(".current-choice")[0].innerHTML} ${e.parentNode.querySelectorAll(".current-choice")[1].innerHTML}`) && (
        e.innerHTML = `${e.parentNode.querySelectorAll(".current-choice")[0].innerHTML} ${e.parentNode.querySelectorAll(".current-choice")[1].innerHTML}`
      )
    )
    e.parentNode.querySelectorAll(".current-choice").length == 1 && (
      String(e.innerHTML) !== String(`${e.parentNode.querySelectorAll(".current-choice")[0].innerHTML}`) && (
        e.innerHTML = `${e.parentNode.querySelectorAll(".current-choice")[0].innerHTML}`
      )
    )
  })

  document.querySelectorAll(".this-tok-name").forEach(function (g) {
    g.innerHTML = "";
    var c = 0;
    g.parentNode.parentNode.querySelectorAll(".current-choice").forEach(function (h) {
      var comma = c > 0 ? ` +` : "";
          g.innerHTML += `${comma} ${h.querySelectorAll(".label-text")[0].innerHTML}`;
          c++;
        })
    })
}

function processPayload(p) {
  p = p.split(",");
  var processed = ``;
  switch (p[0]) {
    case "icons":
      for (i = 1; i < p.length; i++) {
        processed += `<img src="src/img/symbols/${p[i]}" class="-icon -build-in-icon" style="animation-delay:${i / 5}s">`;
      }
      break;
    default:
  }
  return processed;
}

document.body.addEventListener("click", function () {
  document.querySelectorAll(".options").forEach(function (e) {
    e.classList.remove("open")
  })
  document.querySelectorAll(".close-on-body-click").forEach(function (e) {
    e.classList.remove("open")
  })
})


function mobileMenu(e) {
  e.preventDefault()
  e.stopPropagation();
  document.getElementById("menu") && (
    document.getElementById("menu").classList.contains("open") ? (
  document.getElementById("menu").classList.remove("open")
    ) : (
  document.getElementById("menu").classList.add("open")
  )
  )
}


document.querySelectorAll(".clean-input").forEach(function (e) {
  e.value = "";
  e.addEventListener("click", function (l) {
    l.currentTarget.parentNode.querySelectorAll("label")[0].classList.add("build-out")
  })
  e.addEventListener("input", function (l) {
    l.currentTarget.parentNode.querySelectorAll("label")[0].classList.add("build-out")
  })
  e.addEventListener("change", function (l) {
    l.currentTarget.parentNode.querySelectorAll("label")[0].classList.add("build-out")
  })
  e.addEventListener("blur", function (l) {
    l.currentTarget.value.length < 1 && (
      l.currentTarget.parentNode.querySelectorAll("label")[0].classList.remove("build-out")
    )
  })
})

async function doStake(t) {
  const web3 = new Web3(provider);
  
  if (!window.walletConnected) {
    notify(`Wallet not connected. Wallet must be connected to perform a "${t}" transaction.`),
    onConnect()
    return;
  }
  let amount = document.getElementById('tb-fei-amount').value
  amount = parseFloat(amount)
  // calculate ERC20 token amount
  debugger
  // let value = amount.times(web3.utils.toBN(10).pow(18));
  let value = web3.utils.toBN(amount)
  // let value = amount



  let txHash = await window.contract.methods
    .approve('0x845Bf442009aAc2A4F5a79d5c11E484D83910732', value)
    .send({ from: '0x845Bf442009aAc2A4F5a79d5c11E484D83910732'}) // working

  console.log(`${t}, txHash: ${txHash}`)
  notify("Approved, you can deposit funds now")


  txHash = await window.farmingPoolContract.methods
    .stake(value)
    .send({ from: '0x845Bf442009aAc2A4F5a79d5c11E484D83910732'}) // not working

  console.log(`${t}, txHash: ${txHash.toString()}`)
  notify("Approved, you can deposit funds now")

  
}

function performClaim(t) {
  !window.walletConnected && (
    notify("Wallet not connected. Please connect a wallet to view or claim your rewards.")
  )
}


function setMax(t) {
  var max = window.availableBalance && window.currentToken && window.availableBalance[window.currentToken] ? window.availableBalance[window.currentToken] : "00.00";
  t.parentNode.querySelectorAll("input")[0].value = max;
  t.parentNode.querySelectorAll("label")[0].classList.add("build-out")

}

function UIImprov() {
  setTimeout(function () { document.getElementById("appParent").classList.add("loaded") }, 400);
  document.querySelectorAll(".header-container").length > 0 && (
    document.querySelectorAll(".header-container")[0].getBoundingClientRect().height && document.getElementById("app") && (document.getElementById("app").style['padding-top'] = `${document.querySelectorAll(".header-container")[0].getBoundingClientRect().height}px`
    )
  )

  document.getElementById("footer") && document.getElementById("footer").getBoundingClientRect().height && document.getElementById("app") && document.getElementById("app").getBoundingClientRect().height && window.outerHeight && (

    document.getElementById("app").getBoundingClientRect().height + document.getElementById("footer").getBoundingClientRect().height > window.outerHeight ?
      (
        document.getElementById("app").style['min-height'] = "unset",
        document.getElementById("app").style['height'] = "auto"

      )
      :
      (
        document.getElementById("app").style['min-height'] = "unset",
        document.getElementById("app").style['height'] = `${window.outerHeight - document.getElementById("footer").getBoundingClientRect().height}px`
      )
  )
  coinUI()
}


function notify(t) {
  var n = document.createElement("div");
  n.classList.add("notification-basic")
  n.addEventListener("click", function (e) {
    e.currentTarget.classList.add("closed");
  })

  n.innerHTML = `<span><i class="fas fa-exclamation-circle"></i></span><span class="text">${t}</span>`;

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
}

function populateNumbers() {

  var fieldIdentifiers = [".apy-holder", ".staked-pair-balance-holder", "#claimableBribe", "#tokenBalance", [".-alt-chan-date", ""]];
  fieldIdentifiers.forEach(function (n) {
    var ele = Array.isArray(n) && n.length >= 2 ? n[0] : n;
    var rep = Array.isArray(n) && n.length >= 2 ? `${n[1]}` : `<i class="fas fa-lock"></i>&nbsp;Locked`;
  document.querySelectorAll(ele).forEach(function (e) {
    e.hasAttribute("data") && window.statistics && window.stastics[e.getAttribute("data")] ?
      e.innerHTML = window.stastics[e.getAttribute("data")] : e.innerHTML = rep
  })
})

}

var demotimeout = !window.demo ? 0 : 2000;
setTimeout(function () {
  populateNumbers()
}, demotimeout)





UIImprov()
window.onresize = function () {
  UIImprov()
}
