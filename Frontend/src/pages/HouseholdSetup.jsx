import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiPlus, FiLogIn, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import API from "../api/axios";

function HouseholdSetup() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);

  const [createData, setCreateData] = useState({
    name: "",
    description: "",
  });

  const [inviteCode, setInviteCode] = useState("");
  const [createdHousehold, setCreatedHousehold] = useState(null);

  // ====================
  // Create Household
  // ====================

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!createData.name.trim()) {
      return toast.error("Household name is required");
    }

    try {
      setLoading(true);

      const response = await API.post("/households", {
        name: createData.name.trim(),
        description: createData.description.trim(),
      });

      const household = response.data.household;

      localStorage.setItem("hishabio-household-id", household._id);

      setCreatedHousehold(household);

      toast.success("Household created successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create household",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================
  // Join Household
  // ====================

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      return toast.error("Please enter an invite code");
    }

    try {
      setLoading(true);

      const response = await API.post("/households/join", {
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      const household = response.data.household;

      localStorage.setItem("hishabio-household-id", household._id);

      setCreatedHousehold(household);

      toast.success("Joined household successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join household");
    } finally {
      setLoading(false);
    }
  };

  // ====================
  // Continue to Dashboard
  // ====================

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* ====================
            Header
            ==================== */}

        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <FiHome size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Welcome to Hishabio!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Create a new household or join an existing one to start managing
            shared expenses together.
          </p>
        </div>

        {createdHousehold ? (
          /* ====================
             Success Section
             ==================== */

          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FiHome size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              You're all set!
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your household is ready to use.
            </p>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Household Name
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {createdHousehold.name}
              </h3>

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Invite Code
                </p>

                <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3">
                  <span className="text-xl font-bold tracking-[0.2em] text-indigo-700">
                    {createdHousehold.inviteCode}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        createdHousehold.inviteCode,
                      );
                      toast.success("Invite code copied!");
                    }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700"
            >
              Continue to Dashboard
              <FiArrowRight />
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            {/* ====================
                Tab Switcher
                ==================== */}

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-2">
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  activeTab === "create"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FiPlus />
                Create Household
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("join")}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  activeTab === "join"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FiUsers />
                Join Household
              </button>
            </div>

            {/* ====================
                Create Household Form
                ==================== */}

            {activeTab === "create" && (
              <form
                onSubmit={handleCreate}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
              >
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <FiHome size={23} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Create a Household
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Set up a shared space for managing your expenses.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Household Name
                    </label>

                    <input
                      type="text"
                      value={createData.name}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Friends Mess"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                      <span className="ml-1 font-normal text-slate-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      rows="4"
                      value={createData.description}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Tell us something about your household..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-indigo-50 p-4">
                  <p className="text-sm leading-6 text-indigo-700">
                    <strong>Note:</strong> You'll automatically become the Admin
                    of this household. You can invite others using your
                    household invite code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiPlus />
                  {loading ? "Creating..." : "Create Household"}
                </button>
              </form>
            )}

            {/* ====================
                Join Household Form
                ==================== */}

            {activeTab === "join" && (
              <form
                onSubmit={handleJoin}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
              >
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <FiUsers size={23} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Join a Household
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Enter the invite code shared by your household Admin.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Household Invite Code
                  </label>

                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) =>
                      setInviteCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter invite code"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg font-bold uppercase tracking-[0.2em] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div className="mt-6 rounded-xl bg-purple-50 p-4">
                  <p className="text-sm leading-6 text-purple-700">
                    Make sure you enter the correct invite code. You will become
                    a Member after joining successfully.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiLogIn />
                  {loading ? "Joining..." : "Join Household"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HouseholdSetup;
