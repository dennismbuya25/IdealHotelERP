@@ .. @@
     number VARCHAR(10) NOT NULL UNIQUE,
-    type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', suite', 'deluxe')),
+    type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', 'suite', 'deluxe')),
     status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'dirty', 'maintenance', 'out-of-order')),