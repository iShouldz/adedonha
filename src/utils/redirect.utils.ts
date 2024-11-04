export const shareOnWhatsApp = () => {
  const text =
    "Venha jogar adedonha da maneira classica so que bem melhor! :) https://adedonha.vercel.app";
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

export const shareOnTwitter = () => {
  const text =
    "Venha jogar adedonha da maneira classica so que bem melhor! :) https://adedonha.vercel.app";
  const url = "https://adedonha.vercel.app";
  const hashtags = "adedonha,sharing";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}&hashtags=${hashtags}}`;

  window.open(twitterUrl, "_blank");
};

export const openGithub = () => {
  window.open("https://github.com/iShouldz", "_blank");
};
