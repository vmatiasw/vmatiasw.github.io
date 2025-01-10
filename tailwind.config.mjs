/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      textColor: {
        skin: {
          primary: withOpacity("--text-primary"),
          secondary: withOpacity("--text-secondary"),
          contrast: withOpacity("--text-contrast"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--background-primary"),
          "button-primary": withOpacity("--button-primary"),
          "button-secondary": withOpacity("--button-secondary"),
        },
      },
      colors: {
        skin: {
          muted: withOpacity("--muted"),
          accent: withOpacity("--accent"),
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("not-print", "@media not print");
      addVariant("below-md", "@media (max-width: 768px)");
    },
  ],
};
