import { supabase } from './supabaseClient'

export const signUpUser = async (formData: any) => {
  console.log("SIGNUP FUNCTION STARTED")

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    console.error("AUTH ERROR:", error)
    return { success: false, error }
  }

  if (!data.user) {
    console.error("No user returned")
    return { success: false }
  }

  // 2. Insert into profiles (ADMIN SYSTEM LIVES HERE 👑)
  const { error: dbError } = await supabase
    .from("profiles")
    .insert([
      {
        id: data.user.id,
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
         city: formData.city || null,       
        subcity: formData.subcity || null,
        woreda: formData.woreda || null,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        marital_status: formData.maritalStatus || null,
        previous_church: formData.previousChurch || null,
        baptism_date: formData.baptismDate || null,
        baptism_place: formData.baptismPlace || null,

        // 👑 ADMIN SYSTEM CORE
        role: "user",
        status: "pending",
      },
    ])

  if (dbError) {
    console.error("DB ERROR:", dbError)
    return { success: false, dbError }
  }

  console.log("USER CREATED SUCCESSFULLY")
  return { success: true }
}