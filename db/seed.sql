-- Non-sacrament meetings (stake, general) have no local program, so hymns are stored as '{}'.
INSERT INTO meetings (
  date, meeting_type, presiding, conducting, announcements,
  opening_hymn, opening_prayer, ward_business, stake_business,
  sacrament_hymn, speakers, closing_hymn, closing_prayer
) VALUES
(
  '2026-01-04','testimony','Bishop Thompson','Brother Nakamura',
  ARRAY[]::TEXT[],
  '{"number":134,"title":"I Believe in Christ"}','Sister Park',
  '[]',false,
  '{"number":170,"title":"God, Our Father, Hear Us Pray"}',
  '[]',
  '{"number":219,"title":"Because I Have Been Given Much"}','Brother Alvarez'
),
(
  '2026-01-11','regular','Bishop Thompson','Brother Nakamura',
  ARRAY['Ward temple night: Jan 30'],
  '{"number":2,"title":"The Spirit of God"}','Sister Ramirez',
  '[{"description":"Sustaining of new Sunday School president"}]',true,
  '{"number":183,"title":"In Remembrance of Thy Suffering"}',
  '[{"name":"Sister Chen","topic":"The Sacrament","type":"speaker"},
    {"name":"Brother Osei","topic":"Covenant Keeping","type":"speaker"}]',
  '{"number":31,"title":"O God, Our Help in Ages Past"}','Brother Lewis'
),
(
  '2026-01-18','regular','Bishop Thompson','Sister Torres',
  ARRAY['Ministering interviews this week'],
  '{"number":85,"title":"How Firm a Foundation"}','Brother Kim',
  '[{"description":"Release - Sister Martinez - Primary Teacher"},
    {"description":"Sustain - Sister Agbavor - Primary Teacher"},
    {"description":"Sustain - Sister Mukiwa - RS 2nd Counselor"}]',false,
  '{"number":173,"title":"While of These Emblems We Partake"}',
  '[{"name":"Sister Nakamura","topic":"Personal Revelation","type":"speaker"},
    {"name":"Youth Choir","topic":"","type":"musical-number"},
    {"name":"Brother Santos","topic":"Temple Covenants","type":"speaker"}]',
  '{"number":226,"title":"Improve the Shining Moments"}','Sister Jensen'
),
(
  '2026-01-25','stake','President Gimenez','',
  ARRAY[]::TEXT[],
  '{}','',
  '[]',true,
  '{}',
  '[]',
  '{}',''
),
(
  '2026-02-01','testimony','Bishop Thompson','Brother Wallace',
  ARRAY['Fast offerings may be given to any member of the bishopric'],
  '{"number":19,"title":"We Thank Thee, O God, for a Prophet"}','Sister Whitfield',
  '[]',false,
  '{"number":172,"title":"In Humility, Our Savior"}',
  '[]',
  '{"number":152,"title":"God Be with You Till We Meet Again"}','Brother Haddad'
),
(
  '2026-02-08','regular','Bishop Thompson','Sister Torres',
  ARRAY['Valentine ward dinner: Feb 14','Youth temple trip: Feb 21'],
  '{"number":86,"title":"How Great Thou Art"}','Brother Petrov',
  '[{"description":"Sustain - Brother Delgado - Elders Quorum Secretary"}]',false,
  '{"number":193,"title":"I Stand All Amazed"}',
  '[{"name":"Sister Whitmore","topic":"Charity Never Faileth","type":"speaker"},
    {"name":"Elder Fonoti","topic":"Missionary Work","type":"speaker"}]',
  '{"number":241,"title":"Count Your Blessings"}','Sister Morales'
),
(
  '2026-02-15','regular','Bishop Thompson','Brother Nakamura',
  ARRAY[]::TEXT[],
  '{"number":116,"title":"Come, Follow Me"}','Sister Adeyemi',
  '[]',true,
  '{"number":181,"title":"Jesus of Nazareth, Savior and King"}',
  '[{"name":"Brother Lindqvist","topic":"Repentance and Forgiveness","type":"speaker"},
    {"name":"Primary Children","topic":"I Am a Child of God","type":"musical-number"},
    {"name":"Sister Rahman","topic":"The Atonement of Jesus Christ","type":"speaker"}]',
  '{"number":223,"title":"Have I Done Any Good?"}','Brother Novak'
),
(
  '2026-02-22','regular','Brother Wallace','Brother Nakamura',
  ARRAY['Stake youth dance: Mar 7'],
  '{"number":140,"title":"Did You Think to Pray?"}','Brother Ito',
  '[{"description":"Release - Brother Kim - Ward Clerk"},
    {"description":"Sustain - Brother Haddad - Ward Clerk"}]',false,
  '{"number":187,"title":"God Loved Us, So He Sent His Son"}',
  '[{"name":"Sister Oyelaran","topic":"Gratitude","type":"speaker"},
    {"name":"Brother Castillo","topic":"Tithing and the Windows of Heaven","type":"speaker"}]',
  '{"number":239,"title":"Choose the Right"}','Sister Duarte'
),
(
  '2026-03-01','testimony','Bishop Thompson','Brother Wallace',
  ARRAY['Easter program rehearsal: Mar 28'],
  '{"number":98,"title":"I Need Thee Every Hour"}','Sister Kowalski',
  '[{"description":"Sustain - Sister Achterberg - Young Women Advisor"}]',false,
  '{"number":171,"title":"With Humble Heart"}',
  '[]',
  '{"number":166,"title":"Abide with Me!"}','Brother Tanaka'
),
(
  '2026-03-08','regular','Bishop Thompson','Brother Nakamura',
  ARRAY[]::TEXT[],
  '{"number":27,"title":"Praise to the Man"}','Brother Mensah',
  '[]',true,
  '{"number":176,"title":"''Tis Sweet to Sing the Matchless Love"}',
  '[{"name":"Brother Fairbanks","topic":"The Restoration","type":"speaker"},
    {"name":"Ward Choir","topic":"Joseph Smith''s First Prayer","type":"musical-number"},
    {"name":"Sister Villanueva","topic":"The Power of Prayer","type":"speaker"}]',
  '{"number":254,"title":"True to the Faith"}','Sister Hale'
),
(
  '2026-03-15','regular','Bishop Thompson','Brother Wallace',
  ARRAY['Meetinghouse spring cleaning: Mar 21'],
  '{"number":30,"title":"Come, Come, Ye Saints"}','Sister Lundgren',
  '[]',false,
  '{"number":185,"title":"Reverently and Meekly Now"}',
  '[{"name":"Sister Mbeki","topic":"Pioneers of Faith","type":"speaker"},
    {"name":"Brother Abernathy","topic":"Ministering Like the Savior","type":"speaker"}]',
  '{"number":252,"title":"Put Your Shoulder to the Wheel"}','Brother Quispe'
),
(
  '2026-03-22','regular','Bishop Thompson','Sister Torres',
  ARRAY['Ward temple night: Mar 27','General Conference is April 4-5'],
  '{"number":136,"title":"I Know That My Redeemer Lives"}','Sister Yamamoto',
  '[{"description":"Release - Sister Jensen - Relief Society President"},
    {"description":"Sustain - Sister Park - Relief Society President"}]',false,
  '{"number":191,"title":"Behold the Great Redeemer Die"}',
  '[{"name":"Sister Brooks","topic":"Standing as a Witness","type":"speaker"},
    {"name":"Brother Okonkwo","topic":"The Resurrection","type":"speaker"}]',
  '{"number":243,"title":"Let Us All Press On"}','Brother Rinaldi'
),
(
  '2026-03-29','regular','Bishop Thompson','Brother Nakamura',
  ARRAY[]::TEXT[],
  '{"number":72,"title":"Praise to the Lord, the Almighty"}','Sister Batista',
  '[]',true,
  '{"number":196,"title":"Jesus, Once of Humble Birth"}',
  '[{"name":"Sister Holloway","topic":"Hosanna to the King","type":"speaker"},
    {"name":"Children''s Choir","topic":"Hosanna","type":"musical-number"},
    {"name":"Brother Aguilar","topic":"The Savior''s Final Week","type":"speaker"}]',
  '{"number":3,"title":"Now Let Us Rejoice"}','Brother Ferreira'
),
(
  '2026-04-05','general','First Presidency','',
  ARRAY[]::TEXT[],
  '{}','',
  '[]',false,
  '{}',
  '[]',
  '{}',''
)
ON CONFLICT (date) DO NOTHING
RETURNING id, date, meeting_type;
