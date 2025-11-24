-- data.sql (좌표 정밀 보정 완료)

-- 1. 본부동 (좌표 수정됨)
INSERT INTO buildings (building_id, name, latitude, longitude, description)
VALUES (1, '본부동', 36.839284375195675, 127.18598363925831, '대학 본부 및 행정 시설');

-- 2. 진리관 (좌표 수정됨)
INSERT INTO buildings (building_id, name, latitude, longitude, description)
VALUES (2, '진리관', 36.84015168239436, 127.18454231791016, '주요 강의동 및 교양 수업');

-- 3. 지혜관 (좌표 수정됨)
INSERT INTO buildings (building_id, name, latitude, longitude, description)
VALUES (3, '지혜관', 36.83871918656641, 127.18437351643999, '도서관 및 열람실');

-- 4. 층 (Floors) 데이터 (기존 유지)
INSERT INTO floors (floor_id, building_id, level, name) VALUES (1, 1, 1, '1층 로비');
INSERT INTO floors (floor_id, building_id, level, name) VALUES (2, 1, 2, '2층 행정실');

INSERT INTO floors (floor_id, building_id, level, name) VALUES (3, 2, 1, '1층');
INSERT INTO floors (floor_id, building_id, level, name) VALUES (4, 2, 2, '2층');

-- 5. 강의실/시설 (Rooms) 데이터 (기존 유지)
INSERT INTO rooms (room_id, floor_id, room_number, name, room_type, capacity, features)
VALUES (1, 4, '201', '전공강의실', 'CLASSROOM', 40, '빔프로젝터, 화이트보드');

INSERT INTO rooms (room_id, floor_id, room_number, name, room_type, capacity, features)
VALUES (2, 4, '202', '대형강의실', 'CLASSROOM', 80, '마이크, 스크린');

INSERT INTO rooms (room_id, floor_id, name, room_type, operating_hours)
VALUES (3, 1, '학생 카페', 'FACILITY', '09:00~18:00');

INSERT INTO rooms (room_id, floor_id, name, room_type, operating_hours)
VALUES (4, 1, '편의점', 'FACILITY', '24시간');