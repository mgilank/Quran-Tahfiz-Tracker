import { Hono } from "hono";
import { authMiddleware, adminMiddleware } from "../middleware/auth.ts";
import { db } from "../db/connection.ts";
import { AdminPage } from "../views/pages/AdminPage.tsx";
import type { Env, User } from "../types.ts";

const admin = new Hono<Env>();

admin.use("*", authMiddleware, adminMiddleware);

admin.get("/", (c) => {
  const user = c.get("user");
  const success = c.req.query("success");

  const pendingUsers = db
    .prepare("SELECT * FROM users WHERE role = 'pending' ORDER BY created_at DESC")
    .all() as User[];

  const allUsers = db
    .prepare("SELECT * FROM users WHERE role != 'pending' ORDER BY role DESC, name ASC")
    .all() as User[];

  return c.html(
    <AdminPage user={user} pendingUsers={pendingUsers} allUsers={allUsers} success={success} />
  );
});

admin.post("/users/:id/approve", (c) => {
  const userId = c.req.param("id");
  db.prepare("UPDATE users SET role = 'member', updated_at = datetime('now') WHERE id = ? AND role = 'pending'").run(
    userId
  );
  return c.redirect("/admin?success=User approved successfully.");
});

admin.post("/users/:id/reject", (c) => {
  const userId = c.req.param("id");
  // Delete the user and their sessions
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ? AND role = 'pending'").run(userId);
  return c.redirect("/admin?success=User rejected and removed.");
});

admin.post("/users/:id/role", async (c) => {
  const userId = c.req.param("id");
  const body = await c.req.parseBody();
  const role = body.role as string;

  if (!["member", "admin"].includes(role)) {
    return c.redirect("/admin");
  }

  db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").run(role, userId);
  return c.redirect("/admin?success=User role updated.");
});

admin.post("/users/:id/delete", (c) => {
  const currentUser = c.get("user");
  const userId = parseInt(c.req.param("id"), 10);

  // Cannot delete yourself
  if (userId === currentUser.id) {
    return c.redirect("/admin?success=Cannot delete your own account.");
  }

  // Cannot delete other admins
  const target = db.prepare("SELECT role FROM users WHERE id = ?").get(userId) as { role: string } | null;
  if (!target) return c.redirect("/admin?success=User not found.");
  if (target.role === "admin") {
    return c.redirect("/admin?success=Cannot delete another admin.");
  }

  // ON DELETE CASCADE handles sessions, progress_entries, progress_log
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
  return c.redirect("/admin?success=Member removed successfully.");
});

export { admin as adminRoutes };
