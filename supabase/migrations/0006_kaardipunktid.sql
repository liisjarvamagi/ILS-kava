-- ============================================================
-- 0006: ALADE KOHAD FESTIVALIKAARDIL
-- Käivita Supabase SQL Editoris PÄRAST 0005 faili.
--
-- map_x ja map_y on protsendid festivali kaardipildi laiusest ja
-- kõrgusest (0–100). Need stardikohad on kaardipildi järgi hinnatud;
-- täpsemaks saad nihutada adminipaneelis (Alad → vali ala → klõpsa
-- kaardil õigele kohale).
-- ============================================================

update stages set map_x = 43.6, map_y =  6.3 where slug = 'sunset';     -- 1 Loojangu
update stages set map_x = 56.1, map_y = 25.2 where slug = 'dome';       -- 2 Kuppel
update stages set map_x = 64.9, map_y = 27.8 where slug = 'emalava';    -- 3 Emalava
update stages set map_x = 67.4, map_y = 30.9 where slug = 'piidi';      -- 4 Piidivabrik
update stages set map_x = 74.0, map_y = 41.7 where slug = 'terrass';    -- 5 Terrass
update stages set map_x = 28.4, map_y = 35.2 where slug = 'forest';     -- 6 Metsalava
update stages set map_x = 28.4, map_y = 35.2 where slug = 'forest-day'; -- 6 Metsalava (päevane)
update stages set map_x = 57.6, map_y = 44.9 where slug = 'foodstep';   -- 7 Toiduala lava
update stages set map_x = 97.6, map_y = 38.9 where slug = 'pier';       -- 8 Kai / The Pier
update stages set map_x = 63.0, map_y = 47.7 where slug = 'sauna';      -- Saunaala
update stages set map_x = 60.3, map_y = 39.1 where slug = 'beauty';     -- Iluala
update stages set map_x = 33.3, map_y = 19.4 where slug = 'lounge';     -- Päevatelk
update stages set map_x = 89.3, map_y = 40.2 where slug = 'port';       -- Sadam
update stages set map_x = 74.0, map_y = 43.5 where slug = 'terrace';    -- Terrace Stage (Terrassi juures)

-- Ilma kohata jäävad: village, bubbly, festival — määra adminis,
-- kui tead täpset kohta.
