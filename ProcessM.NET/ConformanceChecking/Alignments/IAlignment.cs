﻿using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessM.NET.ConformanceChecking.Alignments
{
    public interface IAlignment
    {
        double Fitness { get; }
        public int TraceMoveCost { get; }
        public int ModelMoveCost { get; }
        public double OptimalCost { get; }
        public double WorstCost { get; }
    }
}