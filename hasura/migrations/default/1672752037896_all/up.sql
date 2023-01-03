

CREATE TABLE "public"."users" ("id" text NOT NULL, "joined_at" timestamptz NOT NULL, "imported_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "karma" integer NOT NULL, "about" text, PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."users" IS E'Hacker News users';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_users_updated_at"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."stories" ("id" integer NOT NULL, "posted_at" timestamptz NOT NULL, "imported_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" text, "title" text, "text" text, "url" text, "score" integer, "descendants" integer, "dead" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));COMMENT ON TABLE "public"."stories" IS E'Top level Hacker News stories';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_stories_updated_at"
BEFORE UPDATE ON "public"."stories"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_stories_updated_at" ON "public"."stories"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."comments" ("id" integer NOT NULL, "posted_at" timestamptz NOT NULL, "imported_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" text, "story_id" integer NOT NULL, "parent_comment_id" integer, "text" text, "sentiment" numeric, "length" integer, "descendants" integer NOT NULL DEFAULT 0, "dead" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));COMMENT ON TABLE "public"."comments" IS E'Comments on Hacker News stories';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_comments_updated_at"
BEFORE UPDATE ON "public"."comments"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_comments_updated_at" ON "public"."comments"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."comments"
  add constraint "comments_parent_comment_id_fkey"
  foreign key ("parent_comment_id")
  references "public"."comments"
  ("id") on update restrict on delete restrict;

CREATE OR REPLACE FUNCTION public.comment_score(comment comments)
  RETURNS numeric
  LANGUAGE sql
  STABLE
AS $function$
  SELECT CAST((POWER(comment.descendants + 1, 0.5) * POWER(GREATEST(comment.length, 1), 0.25) * comment.sentiment) as NUMERIC)
$function$;

CREATE TABLE "public"."feedback" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "why_use_it" text, "to_be_improved" text, "email" text, PRIMARY KEY ("id") );COMMENT ON TABLE "public"."feedback" IS E'Feedback on HackerDaily';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_feedback_updated_at"
BEFORE UPDATE ON "public"."feedback"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_feedback_updated_at" ON "public"."feedback"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
