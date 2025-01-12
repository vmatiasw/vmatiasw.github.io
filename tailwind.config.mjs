/** @type {import('tailwindcss').Config} */

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
          primary: withOpacity("--background-primary"),
          secondary: withOpacity("--background-secondary"),
        },
      },
      colors: {
        skin: {
          muted: withOpacity("--muted"),
          accent: withOpacity("--accent"),
          interactive: withOpacity("--background-interactive"),
        },
      },
    },
  },
  plugins: [addCustomVariants, addCustomBaseStyles],
};

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

function addCustomVariants({ addVariant }) {
  addVariant("not-print", "@media not print");
  addVariant("below-md", "@media (max-width: 768px)");
}

function addCustomBaseStyles({ addBase }) {
  addBase({
    h1: { fontSize: "2.25rem", lineHeight: "2.5rem" }, // text-4xl
    h2: { fontSize: "1.875rem", lineHeight: "2.25rem" }, // text-3xl
    h3: { fontSize: "1.25rem", lineHeight: "2rem" }, // text-xl
    h4: { fontSize: "1.125rem", lineHeight: "1.75rem" }, // text-lg
    h5: { fontSize: "1rem", lineHeight: "1.5rem" }, // text-base
    h6: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
    p: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
    em: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
    "@media print": {
      h1: { fontSize: "1.875rem", lineHeight: "2rem" }, // text-3xl
      h2: { fontSize: "1.5rem", lineHeight: "1.75rem" }, // text-2xl
      h3: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
      h4: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
      h5: { fontSize: "1rem", lineHeight: "1.25rem" }, // text-base
    },
  });
}
