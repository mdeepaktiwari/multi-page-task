const formSections = document.querySelectorAll(".form-section");
const nextButtons = document.querySelectorAll(".next-step__button");
const previousButtons = document.querySelectorAll(".previous-step__button");
const indicators = document.querySelectorAll(".form-sidebar__step-circled");
const subscriptionTimeButton = document.querySelector(".checkbox div");
const textInput = document.querySelectorAll(".form-personal-info__form-input");
const finalSubcriptionChoice = document.getElementById("final-choice-time");
const plans = document.querySelectorAll(".plan__form-description");
const addOnPlans = document.querySelectorAll(".pick-add-on__container");
const finishingPageList = document.querySelector("#finish-up__add-on-breakup");
const finalPurchasedName = document.querySelector(
  ".finishing-up__purchased-name"
);
const finalPurchasedTime = document.querySelector(
  ".finishing-up__purchased-time"
);
const addOnPlansCheckbox = document.querySelectorAll("input[type='checkbox']");
const yearlyPlan = document.querySelectorAll('[data-subsciptionTime="Yearly"]');
const monthlyPlan = document.querySelectorAll(
  '[data-subsciptionTime="Monthly"]'
);
const nameError = document.getElementById(
  "form-personal-info__form-name-error"
);
const emailError = document.getElementById(
  "form-personal-info__form-email-error"
);
const phoneError = document.getElementById(
  "form-personal-info__form-phone-error"
);
const personalInfo = document.querySelectorAll(
  "input.form-personal-info__form-input"
);

let formData = {
  name: "",
  email: "",
  phone: "",
  planName: "",
  subscriptionTime: "Monthly",
  subscriptionCost: "",
  addOn: [],
};

const showNode = node => {
  node.classList.remove("hidden");
};

const hideNode = node => {
  node.classList.add("hidden");
};

const setPage = (currentPage, step) => {
  hideNode(formSections[currentPage]);
  showNode(formSections[currentPage + step]);
  indicators[currentPage].classList.remove("active-step");
  indicators[Math.min(currentPage + step, indicators.length - 1)].classList.add(
    "active-step"
  );
};

const getPersonalInformation = () => {
  return {
    name: personalInfo[0].value,
    email: personalInfo[1].value,
    phone: personalInfo[2].value,
  };
};

document.addEventListener("click", e => {
  const target = e.target;
  if (target === nextButtons[0]) {
    const enteredInformation = getPersonalInformation();
    const result = validateEnteredInformation(enteredInformation);
    if (!result) {
      return;
    }
    formData = {
      ...formData,
      ...enteredInformation,
    };
    setPage(0, 1);
  } else if (target === previousButtons[0]) {
    setPage(1, -1);
  } else if (target === nextButtons[1]) {
    if (!formData.planName) {
      window.alert("Please select a plan");
      return;
    }
    setPage(1, 1);
  } else if (target === previousButtons[1]) {
    setPage(2, -1);
  } else if (target === nextButtons[2]) {
    showFinishDetails();
    setPage(2, 1);
  } else if (target === previousButtons[2]) {
    setPage(3, -1);
  } else if (target === nextButtons[3]) {
    if (window.confirm("Are you sure?")) {
      setPage(3, 1);
    }
  } else if (target.id === "change-plan") {
    setPage(3, -2);
  }
});

textInput.forEach((e, idx) => {
  e.addEventListener("keydown", () => {
    if (idx === 0) {
      nameError.textContent = "";
    }
    if (idx === 1) {
      emailError.textContent = "";
    }
    if (idx === 2) {
      phoneError.textContent = "";
    }
  });
});

const validateEnteredInformation = data => {
  if (!data?.name) {
    nameError.textContent = "This field is required";
    return false;
  }
  if (!data?.email) {
    emailError.textContent = "This field is required";
    return false;
  }
  if (data?.email?.split("@").length !== 2) {
    emailError.textContent = "Please enter a valid email";
    return false;
  }
  if (!data?.phone) {
    phoneError.textContent = "This field is required";
    return false;
  }
  return true;
};

subscriptionTimeButton.addEventListener("click", () => {
  formData.subscriptionTime =
    formData.subscriptionTime === "Monthly" ? "Yearly" : "Monthly";
  fixSubsciptionCost(formData.subscriptionTime);

  const checkbox = document.querySelector(".checkbox > div");
  const time = document.querySelectorAll(".checkbox > span");
  checkbox.style.justifyContent =
    formData.subscriptionTime === "Monthly" ? "start" : "end";
  time[0].classList.toggle("active-time-option");
  time[1].classList.toggle("active-time-option");
  if (formData.subscriptionTime === "Yearly") {
    yearlyPlan.forEach(node => {
      showNode(node);
    });
    monthlyPlan.forEach(node => {
      hideNode(node);
    });
  } else {
    monthlyPlan.forEach(node => {
      showNode(node);
    });
    yearlyPlan.forEach(node => {
      hideNode(node);
    });
  }
  finalSubcriptionChoice.innerHTML = formData?.subscriptionTime?.toLowerCase();
});

plans?.forEach((e, idx) => {
  e.addEventListener("click", e => {
    plans.forEach(e => e.classList.remove("active-plan"));
    plans[idx].classList.add("active-plan");
    formData.planName = plans[idx].getAttribute("data-plan-name");
    formData.subscriptionCost =
      formData.subscriptionTime === "Monthly"
        ? parseInt(plans[idx].getAttribute("data-monthlyCost"))
        : parseInt(plans[idx].getAttribute("data-monthlyCost")) * 10;
  });
});

const fixSubsciptionCost = subsciptionTime => {
  if (!formData.subscriptionCost) {
    return;
  } else {
    if (subsciptionTime === "Monthly") {
      formData.subscriptionCost = formData.subscriptionCost / 10;
    } else {
      formData.subscriptionCost = formData.subscriptionCost * 10;
    }
  }
};

addOnPlansCheckbox.forEach((e, idx) => {
  e.addEventListener("click", e => {
    addOnPlans[idx].classList.toggle("active-plan");
    let addOn = [];
    for (let i = 0; i < addOnPlansCheckbox.length; i++) {
      if (addOnPlansCheckbox[i].checked) {
        let price =
          formData.subscriptionTime === "Monthly"
            ? parseInt(addOnPlans[i].getAttribute("data-addOndMonthlyCost"))
            : parseInt(addOnPlans[i].getAttribute("data-addOndMonthlyCost")) *
              10;

        let detail = addOnPlans[i].getAttribute("data-addOnDescription");
        const newAddOn = {
          price,
          detail,
        };
        addOn.push(newAddOn);
      }
    }
    formData.addOn = addOn;
  });
});

const showFinishDetails = () => {
  finalPurchasedTime.innerText = formData.subscriptionTime;
  finalPurchasedName.innerText = formData.planName;
  document.querySelector(".finishing-up__purchased-price .price").innerText =
    formData.subscriptionCost;
  document.querySelector(".finishing-up__purchased-price .time").innerText =
    formData.subscriptionTime === "Monthly" ? "mo" : "yr";
  document.querySelector(".finishing-total-price .time").innerText =
    formData.subscriptionTime === "Monthly" ? "mo" : "yr";
  // remove all items and then add new
  finishingPageList.innerHTML = "";
  for (let items of formData.addOn) {
    finishingPageList.innerHTML += `  <div class="finishing-up__items-breakup">
       <div class="finishing-up__items-breakup-container">
         <div class="finishing-up__items-breakup-name">${items.detail}</div>
         <div class="finishing-up__items-breakup-price">+${items.price}$/${
      formData.subscriptionTime === "Monthly" ? "mo" : "yr"
    }</div>
       </div>
     </div>`;
  }
  let totalCost = formData.subscriptionCost;
  if (formData?.addOn?.length) {
    totalCost += formData?.addOn?.reduce((acc, curr) => {
      acc = curr.price + acc;
      return acc;
    }, 0);
  }

  document.querySelector(".finishing-total-price .price").innerText = totalCost;
};
