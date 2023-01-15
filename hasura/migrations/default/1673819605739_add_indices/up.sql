

CREATE  INDEX "story_index" on
  "public"."comments" using btree ("story_id");

CREATE  INDEX "posted_at_index" on
  "public"."stories" using btree ("posted_at");

CREATE  INDEX "score_index" on
  "public"."stories" using btree ("score");
