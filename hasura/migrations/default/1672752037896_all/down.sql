
DROP TABLE "public"."feedback";

DROP FUNCTION public.comment_score(comment comments);

alter table "public"."comments" drop constraint "comments_parent_comment_id_fkey";

DROP TABLE "public"."comments";

DROP TABLE "public"."stories";

DROP TABLE "public"."users";
