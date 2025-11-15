[`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

```bash
npm run reset-project
```


npx expo prebuild
npx expo run:android


<!-- Folder Structure Insights -->

⭐ If logic talks to the backend → put in services
⭐ If logic describes data → put in types
⭐ If logic configures the app → put in config
⭐ If logic is pure reusable functions → put in utils
⭐ If logic manages global or shared state → put in store
⭐ If logic requires React Provider → put in context
