"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAccount } from "wagmi";
import { escrowService } from "@/lib/smart-contracts";

interface Job {
  jobId: string;
  client: string;
  freelancer: string;
  amount: string;
  duration: string;
  isCompleted: boolean;
  isRefunded: boolean;
}

interface EscrowContextType {
  // State
  jobs: Job[];
  activeJobs: Job[];
  userJobs: Job[];
  totalJobs: string;
  isLoading: boolean;
  isPaused: boolean;

  // Actions
  createJob: (
    freelancer: string,
    duration: number,
    amount: string
  ) => Promise<any>;
  releaseJob: (jobId: string) => Promise<any>;
  refundJob: (jobId: string) => Promise<any>;
  emergencyRefundJob: (jobId: string) => Promise<any>;
  autoReleaseJob: (jobId: string) => Promise<any>;
  getJobDetails: (jobId: string) => Promise<Job>;
  refreshJobs: () => Promise<void>;

  // Admin actions
  pauseContract: (state: boolean) => Promise<any>;
  transferOwnership: (newAdmin: string) => Promise<any>;
  initializeContract: () => Promise<any>;
}

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export function EscrowProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize and load data when connected
  useEffect(() => {
    const initialize = async () => {
      if (isConnected && address) {
        await refreshJobs();
        await checkPauseStatus();
      }
    };
    initialize();
  }, [isConnected, address]);

  const refreshJobs = async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    try {
      // Get total jobs
      const total = await escrowService.getTotalJobs();
      console.log("Total jobs from contract:", total);
      setTotalJobs(total);

      // Get active jobs
      const activeJobIds = await escrowService.getActiveJobs();
      const activeJobsData = await escrowService.getMultipleJobs(activeJobIds);
      setActiveJobs(activeJobsData);

      // Get user-specific jobs
      const userJobsData = await escrowService.getUserJobs(address);
      setUserJobs(userJobsData);

      // Combine all unique jobs
      const allJobsMap = new Map();
      [...activeJobsData, ...userJobsData].forEach((job) => {
        allJobsMap.set(job.jobId, job);
      });
      setJobs(Array.from(allJobsMap.values()));
    } catch (error) {
      console.error("Failed to refresh jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPauseStatus = async () => {
    try {
      const paused = await escrowService.isPaused();
      setIsPaused(paused);
    } catch (error) {
      console.error("Failed to check pause status:", error);
    }
  };

  const createJob = async (
    freelancer: string,
    duration: number,
    amount: string
  ) => {
    // Validate inputs before calling the service
    if (!freelancer || freelancer.trim() === "") {
      throw new Error("Freelancer address is required");
    }

    if (duration <= 0) {
      throw new Error("Duration must be greater than 0");
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    try {
      setIsLoading(true);
      const result = await escrowService.deposit(freelancer, duration, amount);
      await refreshJobs(); // Refresh the jobs list
      return result;
    } catch (error) {
      console.error("Failed to create job:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const releaseJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const result = await escrowService.release(jobId);
      await refreshJobs(); // Refresh the jobs list
      return result;
    } catch (error) {
      console.error("Failed to release job:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refundJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const result = await escrowService.refund(jobId);
      await refreshJobs(); // Refresh the jobs list
      return result;
    } catch (error) {
      console.error("Failed to refund job:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const emergencyRefundJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const result = await escrowService.emergencyRefund(jobId);
      await refreshJobs(); // Refresh the jobs list
      return result;
    } catch (error) {
      console.error("Failed to emergency refund job:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const autoReleaseJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const result = await escrowService.autoRelease(jobId);
      await refreshJobs(); // Refresh the jobs list
      return result;
    } catch (error) {
      console.error("Failed to auto-release job:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getJobDetails = async (jobId: string) => {
    try {
      const job = await escrowService.getJob(jobId);
      return job;
    } catch (error) {
      console.error("Failed to get job details:", error);
      throw error;
    }
  };

  const pauseContract = async (state: boolean) => {
    try {
      setIsLoading(true);
      const result = await escrowService.setPaused(state);
      setIsPaused(state);
      return result;
    } catch (error) {
      console.error("Failed to pause contract:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transferOwnership = async (newAdmin: string) => {
    try {
      setIsLoading(true);
      const result = await escrowService.transferOwnership(newAdmin);
      return result;
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeContract = async () => {
    try {
      setIsLoading(true);
      const result = await escrowService.initialize();
      return result;
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: EscrowContextType = {
    // State
    jobs,
    activeJobs,
    userJobs,
    totalJobs,
    isLoading,
    isPaused,

    // Actions
    createJob,
    releaseJob,
    refundJob,
    emergencyRefundJob,
    autoReleaseJob,
    getJobDetails,
    refreshJobs,

    // Admin actions
    pauseContract,
    transferOwnership,
    initializeContract,
  };

  return (
    <EscrowContext.Provider value={value}>{children}</EscrowContext.Provider>
  );
}

export function useEscrow() {
  const context = useContext(EscrowContext);
  if (context === undefined) {
    throw new Error("useEscrow must be used within an EscrowProvider");
  }
  return context;
}
