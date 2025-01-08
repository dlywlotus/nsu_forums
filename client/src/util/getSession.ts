import supabase from "../supabase";

const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;
  const token = session?.access_token;

  return { userId, token };
};

export default getSession;
