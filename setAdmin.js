const admin = require("firebase-admin");
const serviceAccount = require("./adminServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "IsahvwXXSjc1xLRDoSzKQcqI6gG3";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin role assigned to user with UID: ${uid}`);
  })
  .catch((error) => {
    console.error("❌ Error assigning admin role:", error.message);
  });
