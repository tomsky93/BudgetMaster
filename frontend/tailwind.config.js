/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",            
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./node_modules/primereact/**/*.{js,jsx,ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: []
}
