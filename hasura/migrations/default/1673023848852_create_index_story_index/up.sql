CREATE  INDEX "story_index" on
  "public"."comments" using btree ("story_id");
