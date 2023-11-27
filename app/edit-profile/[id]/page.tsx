import { UserProfile } from "@/common.types";
import { getUserProjects } from "@/lib/actions";
import ProfilePage from "@/components/ProfilePage";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const EditUserProfile = async ({ params }: Props) => {
  const session = await getCurrentUser();

  if (!session?.user) redirect("/");

  const result = (await getUserProjects(session?.user?.id)) as unknown as {
    user: UserProfile;
  };

  if (!result?.user) {
    return <p className="no-result-text">Failed to fetch user info.</p>;
  }

  return <ProfilePage user={result?.user} session={session} />;
};

export default EditUserProfile;
