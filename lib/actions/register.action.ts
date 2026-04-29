"use server";

export async function registerUser(data: {
  name: string;
  batchId: string;
  email: string;
  password: string;
}) {
  try {
    const { name, batchId, email, password } = data;

    // Basic validation
    if (!name || !batchId || !email || !password) {
      return { error: "All fields are required" };
    }

    // TODO: Connect to your database here
    // Example:
    // await connectToDB();
    // const existingUser = await User.findOne({ email });
    // if (existingUser) return { error: "Email is already registered" };
    // await User.create({ name, batchId, email, password }); // Make sure to hash password in production!

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { error: error.message || "Failed to register account" };
  }
}
