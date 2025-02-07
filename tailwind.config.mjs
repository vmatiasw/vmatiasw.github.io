/** @type {import('tailwindcss').Config} */

export default {
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
          "bg-primary": withOpacity("--background-primary"),
          muted: withOpacity("--muted"),
          accent: withOpacity("--accent"),
          interactive: withOpacity("--interactive"),
        },
      },
    },
  },
  plugins: [addCustomVariants],
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
  addVariant("cv", ".cv &");
  addVariant("not-cv", ".not-cv &");
  addVariant("not-print", "@media not print &");
  addVariant("below-md", "@media (max-width: 768px)");
  addVariant("below-sm", "@media (max-width: 640px)");
}