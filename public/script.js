document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".submit-btn");
  const urlInput = document.getElementById("url-input");
  const qrToggle = document.getElementById("qr-toggle");

  const resultContainer = document.getElementById("result-container");
  const resultPlaceholder = document.getElementById("result-placeholder");
  const shortUrlElem = document.getElementById("short-url");
  const qrCodeImg = document.getElementById("qr-code-img");
  const urlError = document.getElementById("url-error");

  urlInput.addEventListener("input", () => {
    urlInput.classList.remove("input-error");
    urlError.style.display = "none";
  });

  submitBtn.addEventListener("click", async () => {
    const originalURL = urlInput.value.trim();
    const generateQR = qrToggle.checked;

    urlInput.classList.remove("input-error");
    urlError.style.display = "none";

    if (!originalURL) {
      urlInput.classList.add("input-error");
      urlError.textContent = "Please enter a URL!";
      urlError.style.display = "block";
      urlInput.focus();
      return;
    }

    if (
      !originalURL.startsWith("https://") &&
      !originalURL.startsWith("http://")
    ) {
      urlInput.classList.add("input-error");
      urlError.textContent = "Invalid URL!";
      urlError.style.display = "block";
      urlInput.focus();
      return;
    }

    // Disable button to prevent multiple submissions
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Processing... <span>&rarr;</span>";

    try {
      const response = await fetch("/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalURL, generateQR }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show result
        resultPlaceholder.style.display = "none";
        resultContainer.style.display = "block";

        shortUrlElem.href = data.shortUrl;
        shortUrlElem.textContent = data.shortUrl;

        if (data.qrCode) {
          qrCodeImg.src = data.qrCode;
          qrCodeImg.style.display = "block";
        } else {
          qrCodeImg.style.display = "none";
          qrCodeImg.src = "";
        }
      } else {
        urlInput.classList.add("input-error");
        urlError.textContent = data.error || "An error occurred!";
        urlError.style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      urlInput.classList.add("input-error");
      urlError.textContent = "Connection Error!";
      urlError.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
